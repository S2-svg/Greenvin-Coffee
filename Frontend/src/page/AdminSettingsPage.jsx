import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getSettings, updateSettings } from '@/lib/adminApi';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSettings();
        setSettings(res.data || {});
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const flattenSettings = () => {
    const flat = [];
    Object.entries(settings).forEach(([group, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => flat.push({ ...item, group }));
      }
    });
    return flat;
  };

  const updateSetting = (key, value) => {
    setSettings(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(group => {
        if (Array.isArray(next[group])) {
          next[group] = next[group].map(s => s.key === key ? { ...s, value } : s);
        }
      });
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const flat = flattenSettings();
      await updateSettings(flat.map(s => ({ key: s.key, value: s.value, group: s.group })));
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getValue = (key) => {
    for (const group of Object.values(settings)) {
      if (Array.isArray(group)) {
        const found = group.find(s => s.key === key);
        if (found) return found.value;
      }
    }
    return '';
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
      <Helmet><title>Settings - Greenvin Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage store configuration.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" /> General Settings
              </CardTitle>
              <CardDescription>Basic store information and configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input id="store_name" value={getValue('store_name')} onChange={(e) => updateSetting('store_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_phone">Phone Number</Label>
                  <Input id="store_phone" value={getValue('store_phone')} onChange={(e) => updateSetting('store_phone', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store_address">Address</Label>
                <Input id="store_address" value={getValue('store_address')} onChange={(e) => updateSetting('store_address', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_email">Email</Label>
                  <Input id="store_email" type="email" value={getValue('store_email')} onChange={(e) => updateSetting('store_email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value={getValue('currency')} onChange={(e) => updateSetting('currency', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax & Pricing</CardTitle>
              <CardDescription>Configure tax rate and pricing rules.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="tax_rate">Tax Rate (decimal)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={getValue('tax_rate')}
                  onChange={(e) => updateSetting('tax_rate', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Example: 0.08 = 8%. Used for calculating order tax.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bakong / KHQR Configuration</CardTitle>
              <CardDescription>Configure your Bakong merchant account for KHQR payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bakong_account_id">Bakong Account ID / Email</Label>
                  <Input 
                    id="bakong_account_id" 
                    placeholder="e.g. name@aba" 
                    value={getValue('bakong_account_id')} 
                    onChange={(e) => updateSetting('bakong_account_id', e.target.value)} 
                  />
                  <p className="text-[10px] text-muted-foreground">Your Bakong ID where money will be sent.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="khqr_verification_mode">Verification Mode</Label>
                  <select 
                    id="khqr_verification_mode"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={getValue('khqr_verification_mode') || 'auto'}
                    onChange={(e) => updateSetting('khqr_verification_mode', e.target.value)}
                  >
                    <option value="auto">Automatic (API Token required)</option>
                    <option value="manual">Manual (Staff confirms receipt)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bakong_merchant_name">Merchant Name</Label>
                  <Input 
                    id="bakong_merchant_name" 
                    value={getValue('bakong_merchant_name')} 
                    onChange={(e) => updateSetting('bakong_merchant_name', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bakong_merchant_city">Merchant City</Label>
                  <Input 
                    id="bakong_merchant_city" 
                    value={getValue('bakong_merchant_city')} 
                    onChange={(e) => updateSetting('bakong_merchant_city', e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bakong_api_token">Bakong API Token</Label>
                <Input 
                  id="bakong_api_token" 
                  type="password"
                  placeholder="Only needed for Automatic mode"
                  value={getValue('bakong_api_token')} 
                  onChange={(e) => updateSetting('bakong_api_token', e.target.value)} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Current Tax Rate</p>
                <p className="font-bold text-lg">{(parseFloat(getValue('tax_rate')) * 100).toFixed(0)}%</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground text-xs">Store Name</p>
                <p className="font-medium">{getValue('store_name') || 'Not set'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground text-xs">Currency</p>
                <p className="font-medium">{getValue('currency') || 'USD'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
