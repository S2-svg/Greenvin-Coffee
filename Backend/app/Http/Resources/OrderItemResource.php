<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'menu_item_id' => $this->menu_item_id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'quantity' => (int) $this->quantity,
            'line_total' => (float) $this->line_total,
            'lineTotal' => (float) $this->line_total, // Compatibility with some frontend parts
        ];
    }
}
