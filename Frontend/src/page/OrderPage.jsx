import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DrinkCard from '@/components/DrinkCard.jsx';
import FoodCard from '@/components/FoodCard.jsx';
import CartItem from '@/components/CartItem.jsx';
import KHQRPaymentDialog from '@/components/KHQRPaymentDialog.jsx';
import { getMenu, createOrder } from '@/lib/api.js';
import { useCart } from '@/hooks/useCart.js';
import { toast } from 'sonner';

export default function OrderPage() {
  const [allItems, setAllItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'paid'

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setIsLoading(true);
        const menu = await getMenu();
        const flattened = [];
        
        Object.values(menu.drinks).forEach(category => flattened.push(...category));
        Object.values(menu.food).forEach(category => flattened.push(...category));
        
        setAllItems(flattened);
      } catch (err) {
        setError(err.message || 'Failed to load menu items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  const validateCheckout = () => {
    const newErrors = {};
    
    if (!checkoutData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!checkoutData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!checkoutData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!checkoutData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!validateCheckout()) {
      return;
    }

    const orderPayload = {
      customer: {
        name: checkoutData.name,
        email: checkoutData.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
      },
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);

    try {
      const order = await createOrder(orderPayload);
      setConfirmedOrder(order);
      setPaymentDialogOpen(true);
    } catch (error) {
      toast.error(error.message || 'Unable to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (updatedOrder) => {
    setConfirmedOrder(updatedOrder);
    setOrderPlaced(true);
    setPaymentStatus('paid');
    clearCart();
    setCheckoutData({ name: '', email: '', address: '', phone: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const CartSidebar = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add items from the menu to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="font-medium">${(getCartTotal() * 0.08).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${(getCartTotal() * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order online - Greenvin Coffee</title>
        <meta name="description" content="Order your favorite drinks and food from Greenvin Coffee. Browse our menu and place your order for pickup." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="py-12 bg-background flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                    Order online
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Browse our menu and place your order for pickup
                  </p>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="lg" className="relative hidden md:flex">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      View cart
                      {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-secondary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                          {getCartCount()}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>Your cart ({getCartCount()} items)</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 h-[calc(100vh-200px)]">
                      <CartSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.category.includes('past') || item.category.includes('break') || item.category.includes('lunch') ? (
                        <FoodCard item={item} onAddToCart={addToCart} />
                      ) : (
                        <DrinkCard item={item} onAddToCart={addToCart} />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="bg-card rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Your cart</h2>
                    <div className="h-[400px]">
                      <CartSidebar />
                    </div>

                    {cartItems.length > 0 && !orderPlaced && (
                      <form onSubmit={handleCheckout} className="mt-6 space-y-4">
                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold text-foreground mb-4">Checkout details</h3>
                        
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={checkoutData.name}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="Your name"
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={checkoutData.email}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="your.email@example.com"
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive mt-1">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={checkoutData.phone}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="(555) 123-4567"
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="address">Pickup address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={checkoutData.address}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="Street address"
                          />
                          {errors.address && (
                            <p className="text-sm text-destructive mt-1">{errors.address}</p>
                          )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? 'Placing order...' : 'Place order'}
                        </Button>
                      </form>
                    )}

                    <AnimatePresence>
                      {orderPlaced && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="mt-6 p-6 bg-secondary/10 rounded-xl text-center"
                        >
                          <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-foreground mb-2">Order confirmed & Paid</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            We've received your payment! We'll have your order ready for pickup in 15-20 minutes. Order #{confirmedOrder?.id?.slice(0, 8) || 'confirmed'} is now in the queue.
                          </p>
                          
                          <Button
                            onClick={() => {
                              setOrderPlaced(false);
                              setConfirmedOrder(null);
                              setPaymentStatus('pending');
                            }}
                            variant="secondary"
                            className="w-full mt-4"
                          >
                            Place another order
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <KHQRPaymentDialog 
              open={paymentDialogOpen} 
              onOpenChange={setPaymentDialogOpen} 
              order={confirmedOrder} 
              onPaymentSuccess={handlePaymentSuccess}
            />

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="lg" className="w-full relative">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    View cart ({getCartCount()})
                    {getCartCount() > 0 && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-secondary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                        {getCartCount()}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh]">
                  <SheetHeader>
                    <SheetTitle>Your cart ({getCartCount()} items)</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 h-[calc(90vh-200px)] overflow-y-auto">
                    <CartSidebar />
                    
                    {cartItems.length > 0 && !orderPlaced && (
                      <form onSubmit={handleCheckout} className="mt-6 space-y-4">
                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold text-foreground mb-4">Checkout details</h3>
                        
                        <div>
                          <Label htmlFor="mobile-name">Name</Label>
                          <Input
                            id="mobile-name"
                            name="name"
                            value={checkoutData.name}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="Your name"
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="mobile-email">Email</Label>
                          <Input
                            id="mobile-email"
                            name="email"
                            type="email"
                            value={checkoutData.email}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="your.email@example.com"
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive mt-1">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="mobile-phone">Phone</Label>
                          <Input
                            id="mobile-phone"
                            name="phone"
                            type="tel"
                            value={checkoutData.phone}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="(555) 123-4567"
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="mobile-address">Pickup address</Label>
                          <Input
                            id="mobile-address"
                            name="address"
                            value={checkoutData.address}
                            onChange={handleInputChange}
                            className="mt-1 text-gray-900"
                            placeholder="Street address"
                          />
                          {errors.address && (
                            <p className="text-sm text-destructive mt-1">{errors.address}</p>
                          )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? 'Placing order...' : 'Place order'}
                        </Button>
                      </form>
                    )}

                    <AnimatePresence>
                      {orderPlaced && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="mt-6 p-6 bg-secondary/10 rounded-xl text-center"
                        >
                          <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-foreground mb-2">Order confirmed & Paid</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            We've received your payment! We'll have your order ready for pickup in 15-20 minutes. Order #{confirmedOrder?.id?.slice(0, 8) || 'confirmed'} is now in the queue.
                          </p>
                          
                          <Button
                            onClick={() => {
                              setOrderPlaced(false);
                              setConfirmedOrder(null);
                              setPaymentStatus('pending');
                            }}
                            variant="secondary"
                            className="w-full mt-4"
                          >
                            Place another order
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
