<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'order_source' => $this->order_source,
            'khqr' => $this->khqr,
            'khqr_md5' => $this->khqr_md5,
            'created_at' => $this->created_at,
            'createdAt' => $this->created_at, // camelCase for frontend
            
            'customer' => [
                'name' => $this->customer_name,
                'email' => $this->customer_email,
                'phone' => $this->customer_phone,
                'address' => $this->customer_address,
            ],
            
            // Flattened fields for compatibility with POSPage
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'customer_address' => $this->customer_address,

            'totals' => [
                'subtotal' => (float) $this->subtotal,
                'tax' => (float) $this->tax,
                'total' => (float) $this->total,
            ],
            
            // Flattened fields for compatibility with POSPage
            'subtotal' => (float) $this->subtotal,
            'tax' => (float) $this->tax,
            'total' => (float) $this->total,

            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
