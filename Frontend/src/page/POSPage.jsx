import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Printer, 
  CheckCircle,
  Loader2,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMenu, createOrder } from '@/lib/api.js';
import { toast } from 'sonner';
import KHQRPaymentDialog from '@/components/KHQRPaymentDialog.jsx';

export default function POSPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('N/A');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'khqr'
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const menu = await getMenu();
        const all = [];
        const cats = new Set();
        
        Object.values(menu.drinks).forEach(categoryItems => {
          categoryItems.forEach(item => {
            all.push(item);
            cats.add(item.category);
          });
        });
        
        Object.values(menu.food).forEach(categoryItems => {
          categoryItems.forEach(item => {
            all.push(item);
            cats.add(item.category);
          });
        });
        
        setMenuItems(all);
        setCategories(['all', ...Array.from(cats)]);
      } catch (err) {
        toast.error('Failed to load menu items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const orderPayload = {
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
      payment_method: paymentMethod,
      order_source: 'pos'
    };

    setIsSubmitting(true);
    try {
      const order = await createOrder(orderPayload);
      if (paymentMethod === 'khqr') {
        setConfirmedOrder(order);
        setPaymentDialogOpen(true);
      } else {
        setConfirmedOrder(order);
        setOrderSuccess(true);
        toast.success('Order placed successfully (Cash)');
        setCart([]);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (updatedOrder) => {
    setConfirmedOrder(updatedOrder);
    setOrderSuccess(true);
    setCart([]);
    toast.success('Payment verified successfully');
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const printReceipt = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-muted/20 overflow-hidden">
      <Helmet>
        <title>POS - Greenvin Coffee</title>
      </Helmet>

      {/* Header */}
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/"><ArrowLeft className="w-5 h-5" /></a>
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            POS Terminal
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            System Online
          </Badge>
          <Button variant="ghost" size="sm" asChild>
            <a href="/kds">Switch to KDS</a>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Item Selection */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden border-r">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <Button 
                  key={cat} 
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className="capitalize whitespace-nowrap"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map(item => (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:border-primary transition-colors group overflow-hidden flex flex-col"
                  onClick={() => addToCart(item)}
                >
                  <div className="aspect-square bg-muted relative">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=200&auto=format&fit=crop'} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/50 backdrop-blur-sm border-none">
                        ${item.price.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3 text-center flex-1 flex flex-col justify-center">
                    <p className="text-sm font-semibold line-clamp-2">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">{item.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Cart/Bill Summary */}
        <div className="w-96 bg-background flex flex-col shadow-xl z-10">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold mb-4">Current Order</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Customer Name</label>
                <Input 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Phone Number</label>
                <Input 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <ShoppingBag className="w-12 h-12 mb-2" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-muted rounded-lg overflow-hidden border">
                        <button 
                          className="p-1 hover:bg-muted-foreground/10 transition-colors"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          className="p-1 hover:bg-muted-foreground/10 transition-colors"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-muted/30 border-t space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant={paymentMethod === 'cash' ? 'default' : 'outline'} 
                className="flex flex-col h-auto py-3 gap-1"
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button 
                variant={paymentMethod === 'khqr' ? 'default' : 'outline'} 
                className="flex flex-col h-auto py-3 gap-1"
                onClick={() => setPaymentMethod('khqr')}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">KHQR</span>
              </Button>
            </div>

            <Button 
              className="w-full h-12 text-lg font-bold shadow-lg" 
              disabled={cart.length === 0 || isSubmitting}
              onClick={handleCheckout}
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Process Order'}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border shadow-2xl rounded-2xl max-w-md w-full p-8 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
              <p className="text-muted-foreground mb-8">
                Order #{confirmedOrder?.id?.slice(0, 8)} has been placed and sent to the kitchen.
              </p>

              <div className="space-y-3">
                <Button className="w-full gap-2" size="lg" onClick={printReceipt}>
                  <Printer className="w-5 h-5" /> Print Receipt
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setOrderSuccess(false);
                    setConfirmedOrder(null);
                  }}
                >
                  New Order
                </Button>
              </div>

              {/* Hidden Receipt for Printing */}
              <div className="hidden print:block fixed inset-0 bg-white p-8 text-left text-black" id="receipt-print">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold uppercase">Greenvin Coffee</h1>
                  <p className="text-sm">Phnom Penh, Cambodia</p>
                  <p className="text-xs text-muted-foreground">Order: #{confirmedOrder?.id?.slice(0, 8)}</p>
                  <p className="text-xs">{new Date().toLocaleString()}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 mb-6">
                  {confirmedOrder?.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${item.line_total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${confirmedOrder?.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%):</span>
                    <span>${confirmedOrder?.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>${confirmedOrder?.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-8 text-center text-xs italic">
                  Thank you for your visit!
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <KHQRPaymentDialog 
        open={paymentDialogOpen} 
        onOpenChange={setPaymentDialogOpen} 
        order={confirmedOrder} 
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
