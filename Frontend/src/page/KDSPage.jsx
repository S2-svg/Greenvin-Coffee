import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Loader2, 
  RefreshCw,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getOrders, updateOrderStatus } from '@/lib/api.js';
import { toast } from 'sonner';

const StatusBadge = ({ status }) => {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-blue-100 text-blue-800 border-blue-200',
    preparing: 'bg-orange-100 text-orange-800 border-orange-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <Badge className={`${variants[status] || variants.pending} capitalize border font-medium`}>
      {status}
    </Badge>
  );
};

export default function KDSPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);
      
      const data = await getOrders();
      // Filter out completed and cancelled orders for KDS
      const activeOrders = data.filter(order => 
        !['completed', 'cancelled'].includes(order.status)
      );
      setOrders(activeOrders);
    } catch (err) {
      toast.error('Failed to load active orders');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 5 seconds for a dynamic feel
    const interval = setInterval(() => fetchOrders(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'pending' || currentStatus === 'paid') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'completed';

    if (!nextStatus) return;

    try {
      await updateOrderStatus(orderId, nextStatus);
      toast.success(`Order #${orderId.slice(0, 8)} moved to ${nextStatus}`);
      fetchOrders(true);
    } catch (err) {
      toast.error('Failed to update order status');
    }
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
        <title>KDS - Kitchen Display System</title>
      </Helmet>

      {/* Header */}
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/pos"><ArrowLeft className="w-5 h-5" /></a>
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" />
            Kitchen Display
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-3">
            {orders.length} Active Orders
          </Badge>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max">
          {/* Incoming / Preparing Column */}
          <div className="w-80 flex flex-col gap-4">
            <h2 className="font-bold flex items-center gap-2 text-muted-foreground uppercase text-xs tracking-wider">
              <Clock className="w-4 h-4" /> Incoming & Preparing
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {orders
                .filter(o => ['pending', 'paid', 'preparing'].includes(o.status))
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map(order => (
                  <OrderCard key={order.id} order={order} onUpdate={handleStatusUpdate} />
                ))}
            </div>
          </div>

          <Separator orientation="vertical" />

          {/* Ready for Pickup Column */}
          <div className="w-80 flex flex-col gap-4">
            <h2 className="font-bold flex items-center gap-2 text-green-600 uppercase text-xs tracking-wider">
              <CheckCircle className="w-4 h-4" /> Ready for Pickup
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {orders
                .filter(o => o.status === 'ready')
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map(order => (
                  <OrderCard key={order.id} order={order} onUpdate={handleStatusUpdate} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onUpdate }) {
  const getActionText = (status) => {
    if (status === 'pending' || status === 'paid') return 'Start Preparing';
    if (status === 'preparing') return 'Mark as Ready';
    if (status === 'ready') return 'Complete Order';
    return '';
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card className={`overflow-hidden border-2 ${order.status === 'ready' ? 'border-green-500 shadow-green-100' : 'border-border'} shadow-lg`}>
        <CardHeader className="p-4 bg-muted/50 border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-black">#{order.id.slice(0, 8)}</CardTitle>
              <p className="text-xs font-bold text-muted-foreground">{timeAgo(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-muted/30 p-2 rounded border border-border/50">
                <span className="font-bold text-sm">
                  <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-xs mr-2">{item.quantity}x</span>
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <ShoppingBag className="w-3 h-3" />
              <span className="capitalize">{order.order_source || 'Online'}</span>
              <Separator orientation="vertical" className="h-3" />
              <span>{order.customer?.name}</span>
            </div>

            <Button 
              className={`w-full font-bold gap-2 ${order.status === 'ready' ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={() => onUpdate(order.id, order.status)}
            >
              {order.status === 'ready' ? <PackageCheck className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              {getActionText(order.status)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
