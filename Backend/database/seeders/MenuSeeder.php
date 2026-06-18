<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $featuredIds = ['spec-3', 'lat-2', 'cold-1', 'break-4'];

        $menuData = [
            'drinks' => [
                'espresso' => [
                    ['id' => 'esp-1', 'name' => 'Classic Espresso', 'description' => 'Rich, bold shot of our signature dark roast blend', 'price' => 3.25, 'category' => 'espresso', 'image' => 'https://images.unsplash.com/photo-1678791160773-c6d13bf417ac'],
                    ['id' => 'esp-2', 'name' => 'Double Espresso', 'description' => 'Two shots of intense, aromatic espresso', 'price' => 4.5, 'category' => 'espresso', 'image' => 'https://images.unsplash.com/photo-1678791160773-c6d13bf417ac'],
                    ['id' => 'esp-3', 'name' => 'Americano', 'description' => 'Espresso diluted with hot water for a smooth finish', 'price' => 3.75, 'category' => 'espresso', 'image' => 'https://images.unsplash.com/photo-1678791160773-c6d13bf417ac'],
                    ['id' => 'esp-4', 'name' => 'Macchiato', 'description' => 'Espresso marked with a dollop of foamed milk', 'price' => 4.25, 'category' => 'espresso', 'image' => 'https://images.unsplash.com/photo-1678791160773-c6d13bf417ac'],
                ],
                'lattes' => [
                    ['id' => 'lat-1', 'name' => 'Caffe Latte', 'description' => 'Smooth espresso with velvety steamed milk', 'price' => 4.75, 'category' => 'lattes', 'image' => 'https://images.unsplash.com/photo-1521161908453-1cacd0215437'],
                    ['id' => 'lat-2', 'name' => 'Vanilla Latte', 'description' => 'Classic latte sweetened with Madagascar vanilla', 'price' => 5.25, 'category' => 'lattes', 'image' => 'https://images.unsplash.com/photo-1521161908453-1cacd0215437'],
                    ['id' => 'lat-3', 'name' => 'Caramel Latte', 'description' => 'Latte drizzled with house-made caramel sauce', 'price' => 5.5, 'category' => 'lattes', 'image' => 'https://images.unsplash.com/photo-1521161908453-1cacd0215437'],
                    ['id' => 'lat-4', 'name' => 'Hazelnut Latte', 'description' => 'Nutty sweetness blended with rich espresso', 'price' => 5.25, 'category' => 'lattes', 'image' => 'https://images.unsplash.com/photo-1521161908453-1cacd0215437'],
                ],
                'cappuccinos' => [
                    ['id' => 'cap-1', 'name' => 'Classic Cappuccino', 'description' => 'Equal parts espresso, steamed milk, and foam', 'price' => 4.5, 'category' => 'cappuccinos', 'image' => 'https://images.unsplash.com/photo-1626201629367-03921bb3bf8c'],
                    ['id' => 'cap-2', 'name' => 'Dry Cappuccino', 'description' => 'Extra foam for a lighter, airier texture', 'price' => 4.75, 'category' => 'cappuccinos', 'image' => 'https://images.unsplash.com/photo-1626201629367-03921bb3bf8c'],
                    ['id' => 'cap-3', 'name' => 'Wet Cappuccino', 'description' => 'More steamed milk for a creamier experience', 'price' => 4.75, 'category' => 'cappuccinos', 'image' => 'https://images.unsplash.com/photo-1626201629367-03921bb3bf8c'],
                    ['id' => 'cap-4', 'name' => 'Flat White', 'description' => 'Microfoam milk poured over double espresso', 'price' => 5, 'category' => 'cappuccinos', 'image' => 'https://images.unsplash.com/photo-1626201629367-03921bb3bf8c'],
                ],
                'coldBrew' => [
                    ['id' => 'cold-1', 'name' => 'Cold Brew', 'description' => 'Smooth, low-acid coffee steeped for 18 hours', 'price' => 4.5, 'category' => 'coldBrew', 'image' => 'https://images.unsplash.com/photo-1544803591-2267f09d81a3'],
                    ['id' => 'cold-2', 'name' => 'Vanilla Cold Brew', 'description' => 'Cold brew sweetened with vanilla syrup', 'price' => 5, 'category' => 'coldBrew', 'image' => 'https://images.unsplash.com/photo-1544803591-2267f09d81a3'],
                    ['id' => 'cold-3', 'name' => 'Iced Latte', 'description' => 'Espresso and milk over ice', 'price' => 4.75, 'category' => 'coldBrew', 'image' => 'https://images.unsplash.com/photo-1544803591-2267f09d81a3'],
                    ['id' => 'cold-4', 'name' => 'Iced Cappuccino', 'description' => 'Chilled cappuccino with cold foam', 'price' => 4.75, 'category' => 'coldBrew', 'image' => 'https://images.unsplash.com/photo-1544803591-2267f09d81a3'],
                ],
                'specialty' => [
                    ['id' => 'spec-1', 'name' => 'Mocha', 'description' => 'Espresso with chocolate and steamed milk', 'price' => 5.5, 'category' => 'specialty', 'image' => 'https://images.unsplash.com/photo-1632487274350-5fd14a1bdb64'],
                    ['id' => 'spec-2', 'name' => 'White Mocha', 'description' => 'Latte with white chocolate and whipped cream', 'price' => 5.75, 'category' => 'specialty', 'image' => 'https://images.unsplash.com/photo-1632487274350-5fd14a1bdb64'],
                    ['id' => 'spec-3', 'name' => 'Honey Lavender Latte', 'description' => 'Floral notes with local honey sweetness', 'price' => 6, 'category' => 'specialty', 'image' => 'https://images.unsplash.com/photo-1632487274350-5fd14a1bdb64'],
                    ['id' => 'spec-4', 'name' => 'Matcha Latte', 'description' => 'Premium Japanese matcha with steamed milk', 'price' => 5.75, 'category' => 'specialty', 'image' => 'https://images.unsplash.com/photo-1632487274350-5fd14a1bdb64'],
                ],
            ],
            'food' => [
                'pastries' => [
                    ['id' => 'past-1', 'name' => 'Butter Croissant', 'description' => 'Flaky, buttery layers baked fresh daily', 'price' => 3.75, 'category' => 'pastries', 'image' => 'https://images.unsplash.com/photo-1585729986380-5ac3b27521ac'],
                    ['id' => 'past-2', 'name' => 'Almond Croissant', 'description' => 'Filled with almond cream and topped with sliced almonds', 'price' => 4.5, 'category' => 'pastries', 'image' => 'https://images.unsplash.com/photo-1585729986380-5ac3b27521ac'],
                    ['id' => 'past-3', 'name' => 'Blueberry Muffin', 'description' => 'Moist muffin bursting with fresh blueberries', 'price' => 3.5, 'category' => 'pastries', 'image' => 'https://images.unsplash.com/photo-1554781432-97f6388fab35'],
                    ['id' => 'past-4', 'name' => 'Chocolate Chip Muffin', 'description' => 'Double chocolate with Belgian chocolate chips', 'price' => 3.5, 'category' => 'pastries', 'image' => 'https://images.unsplash.com/photo-1554781432-97f6388fab35'],
                ],
                'breakfast' => [
                    ['id' => 'break-1', 'name' => 'Avocado Toast', 'description' => 'Smashed avocado on sourdough with cherry tomatoes', 'price' => 8.5, 'category' => 'breakfast', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                    ['id' => 'break-2', 'name' => 'Breakfast Burrito', 'description' => 'Scrambled eggs, cheese, and salsa in a warm tortilla', 'price' => 7.75, 'category' => 'breakfast', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                    ['id' => 'break-3', 'name' => 'Yogurt Parfait', 'description' => 'Greek yogurt layered with granola and seasonal berries', 'price' => 6.5, 'category' => 'breakfast', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                    ['id' => 'break-4', 'name' => 'Breakfast Bowl', 'description' => 'Quinoa, roasted vegetables, poached egg, and tahini', 'price' => 9.25, 'category' => 'breakfast', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                ],
                'lunch' => [
                    ['id' => 'lunch-1', 'name' => 'Turkey Club Sandwich', 'description' => 'Roasted turkey, bacon, lettuce, tomato on sourdough', 'price' => 10.5, 'category' => 'lunch', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                    ['id' => 'lunch-2', 'name' => 'Caprese Sandwich', 'description' => 'Fresh mozzarella, tomato, basil, and balsamic on ciabatta', 'price' => 9.75, 'category' => 'lunch', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                    ['id' => 'lunch-3', 'name' => 'Caesar Salad', 'description' => 'Romaine, parmesan, croutons, and house-made dressing', 'price' => 8.5, 'category' => 'lunch', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                    ['id' => 'lunch-4', 'name' => 'Quinoa Power Bowl', 'description' => 'Quinoa, kale, chickpeas, avocado, and lemon tahini', 'price' => 11.25, 'category' => 'lunch', 'image' => 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1'],
                ],
            ],
        ];

        foreach ($menuData['drinks'] as $category => $items) {
            foreach ($items as $item) {
                MenuItem::updateOrCreate(
                    ['id' => $item['id']],
                    array_merge($item, [
                        'type' => 'drink',
                        'is_featured' => in_array($item['id'], $featuredIds),
                        'is_available' => true,
                    ])
                );
            }
        }

        foreach ($menuData['food'] as $category => $items) {
            foreach ($items as $item) {
                MenuItem::updateOrCreate(
                    ['id' => $item['id']],
                    array_merge($item, [
                        'type' => 'food',
                        'is_featured' => in_array($item['id'], $featuredIds),
                        'is_available' => true,
                    ])
                );
            }
        }
    }
}
