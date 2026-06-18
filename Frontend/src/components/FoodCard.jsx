import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, UtensilsCrossed } from 'lucide-react';

export default function FoodCard({ item, onAddToCart }) {
  const getCategoryLabel = (category) => {
    const labels = {
      pastries: 'Pastry',
      breakfast: 'Breakfast',
      lunch: 'Lunch'
    };
    return labels[category] || category;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-muted rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-card relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
          <UtensilsCrossed className="w-3 h-3 mr-1" />
          {getCategoryLabel(item.category)}
        </Badge>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
          <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {item.description}
        </p>
        <Button
          onClick={() => onAddToCart(item)}
          variant="secondary"
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to cart
        </Button>
      </div>
    </motion.div>
  );
}