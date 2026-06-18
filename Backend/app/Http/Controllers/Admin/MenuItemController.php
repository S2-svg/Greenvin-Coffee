<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MenuItemController extends Controller
{
    public function index()
    {
        $items = MenuItem::orderBy('type')->orderBy('category')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'type' => 'required|string|in:drink,food',
            'category' => 'required|string|max:80',
            'image' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_available' => 'boolean',
        ]);

        $validated['id'] = $request->id ?? strtolower(Str::slug(explode(' ', $validated['name'])[0])) . '-' . random_int(100, 999);
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['is_available'] = $validated['is_available'] ?? true;

        $item = MenuItem::create($validated);

        return response()->json([
            'success' => true,
            'data' => $item,
        ], 201);
    }

    public function show($id)
    {
        $item = MenuItem::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $item,
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'type' => 'sometimes|string|in:drink,food',
            'category' => 'sometimes|string|max:80',
            'image' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_available' => 'boolean',
        ]);

        $item->update($validated);

        return response()->json([
            'success' => true,
            'data' => $item,
        ]);
    }

    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu item deleted successfully.',
        ]);
    }
}
