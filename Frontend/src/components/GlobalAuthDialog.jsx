import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { login, register } from '@/lib/api';
import { toast } from 'sonner';

export default function GlobalAuthDialog() {
  const { authDialogOpen, authMode, closeAuth, setAuthMode, login: authLogin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (authMode === 'login') {
        res = await login(form.email, form.password);
      } else {
        res = await register(form);
      }
      authLogin(res.token, res.user);
      closeAuth();
      toast.success(authMode === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={authDialogOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {authMode === 'login' 
              ? 'Login to manage your orders and profile.' 
              : 'Join us for a better coffee experience.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="global-auth-name">Full Name</Label>
              <Input 
                id="global-auth-name" 
                placeholder="John Doe" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="global-auth-email">Email Address</Label>
            <Input 
              id="global-auth-email" 
              type="email" 
              placeholder="name@example.com" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="global-auth-password">Password</Label>
            <Input 
              id="global-auth-password" 
              type="password" 
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
            />
          </div>
          
          {authMode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="global-auth-password-confirm">Confirm Password</Label>
                <Input 
                  id="global-auth-password-confirm" 
                  type="password" 
                  value={form.password_confirmation} 
                  onChange={(e) => setForm({...form, password_confirmation: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="global-auth-phone">Phone Number</Label>
                <Input 
                  id="global-auth-phone" 
                  placeholder="012 345 678" 
                  value={form.phone} 
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="global-auth-address">Delivery Address (Optional)</Label>
                <Input 
                  id="global-auth-address" 
                  placeholder="Street 123, Phnom Penh" 
                  value={form.address} 
                  onChange={(e) => setForm({...form, address: e.target.value})}
                />
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {authMode === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          {authMode === 'login' ? (
            <p className="text-muted-foreground">Don't have an account? <button type="button" onClick={() => setAuthMode('register')} className="text-primary font-bold hover:underline">Register</button></p>
          ) : (
            <p className="text-muted-foreground">Already have an account? <button type="button" onClick={() => setAuthMode('login')} className="text-primary font-bold hover:underline">Login</button></p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
