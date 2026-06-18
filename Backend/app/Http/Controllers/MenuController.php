<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::where('is_available', true)->get();
        
        $menu = [
            'drinks' => [],
            'food' => []
        ];

        foreach ($menuItems as $item) {
            if (!isset($menu[$item->type][$item->category])) {
                $menu[$item->type][$item->category] = [];
            }
            $menu[$item->type][$item->category][] = $item;
        }

        return response()->json([
            'success' => true,
            'data' => $menu
        ]);
    }

    public function items()
    {
        return response()->json([
            'success' => true,
            'data' => MenuItem::all()
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'success' => true,
            'data' => MenuItem::findOrFail($id)
        ]);
    }

    public function featured()
    {
        return response()->json([
            'success' => true,
            'data' => MenuItem::where('is_featured', true)->get()
        ]);
    }
}
