<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use KHQR\BakongKHQR;
use KHQR\Models\IndividualInfo;
use KHQR\Models\KHQRData;

class OrderService
{
    protected float $taxRate = 0.08;

    public function __construct()
    {
        $storedRate = Setting::getValue('tax_rate');
        if ($storedRate !== null) {
            $this->taxRate = (float) $storedRate;
        }
    }

    public function createOrder(array $data)
    {
        $items = $this->buildOrderItems($data['items']);
        $totals = $this->calculateTotals($items);

        $order = Order::create([
            'id' => Str::uuid()->toString(),
            'user_id' => auth('sanctum')->id(),
            'customer_name' => $data['customer']['name'],
            'customer_email' => $data['customer']['email'] ?? 'pos@greenvin.com',
            'customer_phone' => $data['customer']['phone'],
            'customer_address' => $data['customer']['address'] ?? 'POS Counter',
            'subtotal' => $totals['subtotal'],
            'tax' => $totals['tax'],
            'total' => $totals['total'],
            'payment_method' => $data['payment_method'] ?? 'khqr',
            'order_source' => $data['order_source'] ?? 'online',
            'status' => ($data['payment_method'] ?? 'khqr') === 'cash' ? 'paid' : 'pending',
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'id' => Str::uuid()->toString(),
                'order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'line_total' => $item['line_total'],
            ]);
        }

        if ($order->payment_method === 'khqr') {
            try {
                $payment = $this->generateKHQR($order);
                $order->update([
                    'khqr' => $payment['qr'],
                    'khqr_md5' => $payment['md5'],
                ]);
            } catch (\Exception $e) {
                Log::warning('KHQR generation failed for order ' . $order->id . ': ' . $e->getMessage());
            }
        }

        return $order->load('items');
    }

    protected function buildOrderItems(array $items)
    {
        return array_map(function ($item) {
            $menuItem = MenuItem::findOrFail($item['id']);
            return [
                'menu_item_id' => $menuItem->id,
                'name' => $menuItem->name,
                'price' => $menuItem->price,
                'quantity' => $item['quantity'],
                'line_total' => round($menuItem->price * $item['quantity'], 2),
            ];
        }, $items);
    }

    protected function calculateTotals(array $items)
    {
        $subtotal = array_reduce($items, function ($carry, $item) {
            return $carry + $item['line_total'];
        }, 0);

        $tax = round($subtotal * $this->taxRate, 2);
        $total = round($subtotal + $tax, 2);

        return [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
        ];
    }

    public function generateKHQR(Order $order)
    {
        $accountId = Setting::getValue('bakong_account_id', env('BAKONG_ACCOUNT_ID'));
        if (!$accountId || str_starts_with($accountId, 'your_') || $accountId === 'developer@devb' || $accountId === 'your_bakong_account_id') {
            Log::warning('KHQR generation skipped: invalid Bakong account ID configured.');
            throw new \Exception('KHQR generation failed: invalid Bakong account ID. Please configure it in Settings.');
        }

        try {
            $merchantName = Setting::getValue('bakong_merchant_name', env('BAKONG_MERCHANT_NAME', 'Greenvin Coffee'));
            $merchantCity = Setting::getValue('bakong_merchant_city', env('BAKONG_MERCHANT_CITY', 'Phnom Penh'));

            $optionalData = [
                'currency' => 'USD',
                'amount' => (float)$order->total,
                'billNumber' => substr($order->id, 0, 10),
                'storeLabel' => 'Greenvin Coffee',
                'terminalLabel' => 'Main',
            ];

            $info = new IndividualInfo(
                $accountId,
                $merchantName,
                $merchantCity,
                'USD',
                (float)$order->total,
                $optionalData['billNumber'],
                $optionalData['storeLabel'],
                $optionalData['terminalLabel']
            );

            $response = BakongKHQR::generateIndividual($info);

            if ($response->status->code !== 0 || empty($response->data['qr'])) {
                throw new \Exception("Failed to generate KHQR: " . ($response->status->message ?? 'Unknown error'));
            }

            return [
                'qr' => $response->data['qr'],
                'md5' => $response->data['md5'],
            ];
        } catch (\Exception $e) {
            Log::error('KHQR generation error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function verifyPayment(Order $order)
    {
        if ($order->status === 'completed' || $order->status === 'paid') {
            return $order;
        }

        $verificationMode = Setting::getValue('khqr_verification_mode', 'auto');
        if ($verificationMode === 'manual') {
            return $order; // Manual verification handled by admin in dashboard
        }

        $apiToken = Setting::getValue('bakong_api_token', env('BAKONG_API_TOKEN'));
        $apiUrl = Setting::getValue('bakong_api_url', env('BAKONG_API_URL'));

        if (!$apiToken || !$order->khqr_md5) {
            return $order;
        }

        try {
            $response = Http::withToken($apiToken)
                ->post($apiUrl, ['md5' => $order->khqr_md5]);

            if ($response->successful()) {
                $result = $response->json();
                if (($result['responseCode'] === 0 || ($result['status']['code'] ?? null) === 0) && !empty($result['data'])) {
                    if ($this->isMatchingPayment($result['data'], $order)) {
                        $order->update(['status' => 'paid']);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('KHQR payment verification failed for order ' . $order->id . ': ' . $e->getMessage());
        }

        return $order;
    }

    protected function isMatchingPayment($transaction, Order $order)
    {
        $paidAmount = (float)$transaction['amount'];
        $expectedAmount = (float)$order->total;
        
        $amountMatches = abs($paidAmount - $expectedAmount) < 0.01;
        $currencyMatches = !isset($transaction['currency']) || $transaction['currency'] === 'USD';
        $recipientMatches = !isset($transaction['toAccountId']) || 
            strtolower($transaction['toAccountId']) === strtolower(Setting::getValue('bakong_account_id', env('BAKONG_ACCOUNT_ID')));

        return $amountMatches && $currencyMatches && $recipientMatches;
    }
}
