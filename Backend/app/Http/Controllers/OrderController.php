<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(Request $request)
    {
        // Validation updated to support both POS and Online orders
        $validated = $request->validate([
            'customer.name' => 'required|string|max:150',
            'customer.email' => 'nullable|email|max:150',
            'customer.phone' => 'required|string|max:50',
            'customer.address' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|string|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'nullable|string|in:khqr,cash',
            'order_source' => 'nullable|string|in:online,pos',
        ]);

        $order = $this->orderService->createOrder($request->all());

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order->load('items'))
        ], 201);
    }

    public function index()
    {
        $query = Order::with('items')->latest();

        if (auth('sanctum')->check()) {
            $query->where('user_id', auth('sanctum')->id());
        } else {
            // For guests, we don't return all orders.
            // They might see orders if they provide a phone, but for now just return empty.
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $orders = $query->paginate(50);
        
        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders)
        ]);
    }

    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => new OrderResource($order)
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,paid,confirmed,preparing,ready,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order->load('items'))
        ]);
    }

    public function verify($id)
    {
        $order = Order::findOrFail($id);
        $updatedOrder = $this->orderService->verifyPayment($order);

        return response()->json([
            'success' => true,
            'data' => new OrderResource($updatedOrder->load('items'))
        ]);
    }
}
