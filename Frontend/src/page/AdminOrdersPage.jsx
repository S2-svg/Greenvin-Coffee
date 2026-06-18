import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, ChevronLeft, ChevronRight, Filter, X,
  ShoppingBag, Clock, ChefHat, CheckCircle, PackageCheck, Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { getAdminOrders, updateAdminOrderStatus, deleteAdminOrder } from '@/lib/adminApi';
import { toast } from 'sonner';

const statusFlow = ['pending', 'paid', 'confirmed', 'preparing', 'ready', 'completed'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  paid: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  preparing: 'bg-orange-100 text-orange-800 border-orange-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getAdminOrders({ search, status: statusFilter, page, per_page: 20 });
      setOrders(res.data || []);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const openDetail = async (order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      toast.success(`Order moved to ${newStatus}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order? This action cannot be undone.')) return;
    try {
      await deleteAdminOrder(id);
      toast.success('Order deleted');
      setDetailOpen(false);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const nextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
    return null;
  };

  const prevStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    if (idx > 0) return statusFlow[idx - 1];
    return null;
  };

  return (
    <div>
      <Helmet><title>Orders - Greenvin Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all orders ({meta.total} total).</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by name, phone, or ID..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setSearch('')}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statusFlow.map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-background rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 font-semibold text-muted-foreground">Order ID</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Customer</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Items</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Total</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Source</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Date</th>
                    <th className="text-right p-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 cursor-pointer" onClick={() => openDetail(order)}>
                      <td className="p-3 font-mono text-xs font-medium">#{order.id?.slice(0, 8)}</td>
                      <td className="p-3">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-[10px] text-muted-foreground">{order.customer_phone}</p>
                      </td>
                      <td className="p-3">
                        <span className="text-muted-foreground">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                      </td>
                      <td className="p-3 font-bold">${order.total?.toFixed(2)}</td>
                      <td className="p-3">
                        <Badge className={`${statusColors[order.status]} capitalize border text-[10px]`}>{order.status}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px] capitalize">{order.order_source || 'N/A'}</Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDetail(order); }}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <Button variant="outline" size="sm" disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order #{selectedOrder?.id?.slice(0, 8)}
              {selectedOrder?.status && (
                <Badge className={`${statusColors[selectedOrder.status]} capitalize border-none`}>{selectedOrder.status}</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.order_source === 'pos' ? 'POS Order' : 'Online Order'} &middot; {selectedOrder?.payment_method?.toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                {selectedOrder.customer_email && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium">{selectedOrder.customer_email}</p>
                  </div>
                )}
                {selectedOrder.customer_address && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Address</p>
                    <p className="font-medium">{selectedOrder.customer_address}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-2">Items ({selectedOrder.items?.length || 0})</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-muted/20 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">{item.quantity}x</span>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">${(item.line_total || item.lineTotal || item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${selectedOrder.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span>Total</span>
                  <span className="text-primary">${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {prevStatus(selectedOrder.status) && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(selectedOrder.id, prevStatus(selectedOrder.status))}>
                      ← {prevStatus(selectedOrder.status)}
                    </Button>
                  )}
                  {nextStatus(selectedOrder.status) && (
                    <Button size="sm" onClick={() => handleStatusUpdate(selectedOrder.id, nextStatus(selectedOrder.status))}>
                      {nextStatus(selectedOrder.status)} →
                    </Button>
                  )}
                  {selectedOrder.status !== 'cancelled' && (
                    <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}>
                      <Ban className="w-3.5 h-3.5 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(selectedOrder.id)}>
                  Delete Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
