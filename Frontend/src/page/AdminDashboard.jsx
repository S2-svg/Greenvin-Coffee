import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ShoppingBag, DollarSign, Coffee, Clock, Loader2, TrendingUp,
  ChefHat, CheckCircle, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getDashboard } from '@/lib/adminApi';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Orders',
      value: data?.orders?.total || 0,
      subtitle: `${data?.orders?.today || 0} today`,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Revenue',
      value: `$${(data?.revenue?.total || 0).toLocaleString()}`,
      subtitle: `$${(data?.revenue?.today || 0).toFixed(2)} today`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Menu Items',
      value: data?.menu_items?.total || 0,
      subtitle: `${data?.menu_items?.available || 0} available`,
      icon: Coffee,
      color: 'bg-amber-500',
    },
    {
      title: 'Monthly Revenue',
      value: `$${(data?.revenue?.this_month || 0).toFixed(2)}`,
      subtitle: 'This month',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  const activeOrders = [
    { label: 'Pending', value: data?.active_orders?.pending || 0, icon: Clock, color: 'text-yellow-600' },
    { label: 'Preparing', value: data?.active_orders?.preparing || 0, icon: ChefHat, color: 'text-orange-600' },
    { label: 'Ready', value: data?.active_orders?.ready || 0, icon: CheckCircle, color: 'text-green-600' },
  ];

  const statusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-indigo-100 text-indigo-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return variants[status] || variants.pending;
  };

  return (
    <div>
      <Helmet><title>Dashboard - Greenvin Admin</title></Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your coffee shop.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-5 h-5 text-white ${stat.color.replace('bg-', '')}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.subtitle}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {activeOrders.map(item => (
                <div key={item.label} className="text-center p-4 bg-muted/30 rounded-xl">
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />
            <h3 className="text-sm font-semibold mb-3">Recent Orders</h3>

            {data?.recent_orders?.length > 0 ? (
              <div className="space-y-2">
                {data.recent_orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <Badge className={`${statusBadge(order.status)} capitalize border-none text-[10px] px-2 py-0.5`}>
                        {order.status}
                      </Badge>
                      <span className="font-medium">#{order.id?.slice(0, 8)}</span>
                      <span className="text-muted-foreground">{order.customer_name}</span>
                    </div>
                    <span className="font-bold">${order.total?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.orders_by_status && Object.keys(data.orders_by_status).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.orders_by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <Badge className={`${statusBadge(status)} capitalize border-none`}>{status}</Badge>
                    <span className="font-bold text-lg">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No data</p>
            )}

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This Month Orders</span>
                <span className="font-semibold">{data?.orders?.this_month || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This Month Revenue</span>
                <span className="font-semibold">${(data?.revenue?.this_month || 0).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
