import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, Loader2, Coffee, Pizza,
  Eye, EyeOff, Star, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/adminApi';
import { toast } from 'sonner';

const emptyForm = {
  name: '', description: '', price: '', type: 'drink',
  category: 'espresso', image: '', is_featured: false, is_available: true,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await getMenuItems();
      setItems(res.data || []);
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      type: item.type,
      category: item.category,
      image: item.image || '',
      is_featured: item.is_featured,
      is_available: item.is_available,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
      };
      if (editingId) {
        await updateMenuItem(editingId, data);
        toast.success('Menu item updated');
      } else {
        await createMenuItem(data);
        toast.success('Menu item created');
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMenuItem(id);
      toast.success('Menu item deleted');
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const categoryLabels = {
    espresso: 'Espresso', lattes: 'Lattes', cappuccinos: 'Cappuccinos',
    coldBrew: 'Cold Brew', specialty: 'Specialty',
    pastries: 'Pastries', breakfast: 'Breakfast', lunch: 'Lunch',
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Helmet><title>Menu Items - Greenvin Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your cafe menu.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'drink', 'food'].map(t => (
            <Button
              key={t}
              variant={typeFilter === t ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'All' : t === 'drink' ? <Coffee className="w-3.5 h-3.5 mr-1" /> : <Pizza className="w-3.5 h-3.5 mr-1" />}
              {t === 'all' ? 'All' : t === 'drink' ? 'Drinks' : 'Food'}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="overflow-hidden group">
                <div className="aspect-[4/3] bg-muted relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      {item.type === 'drink' ? <Coffee className="w-12 h-12" /> : <Pizza className="w-12 h-12" />}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.is_featured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                    {!item.is_available && (
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-1">
                        <EyeOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="w-8 h-8" onClick={() => openEdit(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="w-8 h-8" onClick={() => handleDelete(item.id, item.name)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{categoryLabels[item.category] || item.category}</p>
                    </div>
                    <span className="font-bold text-primary text-sm ml-2">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="outline" className="text-[10px] capitalize">{item.type}</Badge>
                    {item.is_available ? (
                      <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Available</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200">Unavailable</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <Coffee className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No menu items found</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the menu item details.' : 'Fill in the details for the new menu item.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Item name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Item description" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({...form, type: v, category: v === 'drink' ? 'espresso' : 'pastries'})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drink">Drink</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {form.type === 'drink' ? (
                      <>
                        <SelectItem value="espresso">Espresso</SelectItem>
                        <SelectItem value="lattes">Lattes</SelectItem>
                        <SelectItem value="cappuccinos">Cappuccinos</SelectItem>
                        <SelectItem value="coldBrew">Cold Brew</SelectItem>
                        <SelectItem value="specialty">Specialty</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="pastries">Pastries</SelectItem>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch id="available" checked={form.is_available} onCheckedChange={(v) => setForm({...form, is_available: v})} />
                <Label htmlFor="available" className="text-sm">Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="featured" checked={form.is_featured} onCheckedChange={(v) => setForm({...form, is_featured: v})} />
                <Label htmlFor="featured" className="text-sm">Featured</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
