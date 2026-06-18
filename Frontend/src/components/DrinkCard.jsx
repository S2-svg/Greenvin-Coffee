import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Coffee } from 'lucide-react';

export default function DrinkCard({ item, onAddToCart }) {
  const getCategoryLabel = (category) => {
    const labels = {
      espresso: 'Espresso',
      lattes: 'Latte',
      cappuccinos: 'Cappuccino',
      coldBrew: 'Cold Brew',
      specialty: 'Specialty'
    };
    return labels[category] || category;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          <Coffee className="w-3 h-3 mr-1" />
          {getCategoryLabel(item.category)}
        </Badge>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
          <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {item.description}
        </p>
        <Button
          onClick={() => onAddToCart(item)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to cart
        </Button>
      </div>
    </motion.div>
  );
}