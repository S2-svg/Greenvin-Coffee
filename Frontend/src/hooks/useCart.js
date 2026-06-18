import { useContext } from 'react';
import { OrderContext } from '@/contexts/OrderContext.jsx';

export function useCart() {
  const context = useContext(OrderContext);
  
  if (!context) {
    throw new Error('useCart must be used within an OrderProvider');
  }
  
  return context;
}