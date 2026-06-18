import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MenuItemCard({ item, onAddToCart, showAddButton = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
          <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {item.description}
        </p>
        {showAddButton && (
          <Button
            onClick={() => onAddToCart(item)}
            className="w-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to cart
          </Button>
        )}
      </div>
    </motion.div>
  );
}