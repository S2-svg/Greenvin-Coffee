import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, Package, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getOrders } from '@/lib/api.js';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const StatusBadge = ({ status }) => {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Badge className={`${variants[status] || variants.pending} capitalize border font-medium`}>
      {status}
    </Badge>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <>
      <Helmet>
        <title>Order History - Greenvin Coffee</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="py-16 bg-muted/30 flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">Orders</h1>
              <p className="text-muted-foreground">
                View and track recent orders
              </p>
            </motion.div>

            {error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-card rounded-2xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Place your first order to see it here!
                </p>
                <a href="/order" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Go to Menu
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="bg-white flex flex-row items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              Order #{order.id.slice(0, 8)}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={order.status} />
                      </CardHeader>
                      <CardContent className="bg-white py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                              Items
                            </h4>
                            <ul className="space-y-2">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                  <span>
                                    <span className="font-medium">{item.quantity}x</span> {item.name}
                                  </span>
                                  <span className="text-muted-foreground">${item.lineTotal.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Customer
                              </h4>
                              <p className="text-sm font-medium">{order.customer.name}</p>
                              <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                              <p className="text-xs text-muted-foreground">{order.customer.address}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between items-center font-bold">
                                <span>Total</span>
                                <span className="text-lg text-primary">${order.totals.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
