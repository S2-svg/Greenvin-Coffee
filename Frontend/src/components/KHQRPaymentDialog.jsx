import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, QrCode, Smartphone, Info, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyOrderPayment } from '@/lib/api';
import { toast } from 'sonner';

export default function KHQRPaymentDialog({ open, onOpenChange, order, onPaymentSuccess }) {
  const [status, setStatus] = useState('pending'); // 'pending', 'verifying', 'success', 'error'
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const statusRef = useRef(status);
  const openRef = useRef(open);
  const successHandledRef = useRef(false);

  statusRef.current = status;
  openRef.current = open;

  const isManualVerification = order?.paymentVerification === 'manual';

  useEffect(() => {
    if (!open || !order) return;
    
    setStatus('pending');
    setLastCheckedAt(null);
    successHandledRef.current = false;

    if (isManualVerification) {
      return;
    }

    const pollInterval = setInterval(async () => {
      if (statusRef.current === 'success' || !openRef.current) return;
      
      try {
        const response = await verifyOrderPayment(order.id);
        setLastCheckedAt(new Date());
        if (response.status === 'paid' || response.status === 'completed') {
          if (successHandledRef.current) return;
          successHandledRef.current = true;
          setStatus('success');
          toast.success('Payment detected!');
          clearInterval(pollInterval);
          setTimeout(() => {
            onPaymentSuccess(response);
            onOpenChange(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [open, order, isManualVerification]);

  const handleCopy = () => {
    if (order?.khqr) {
      navigator.clipboard.writeText(order.khqr);
      toast.success('KHQR string copied to clipboard');
    }
  };

  const handleDeepLink = () => {
    if (order?.khqr) {
      // Common Bakong deep link format
      const deepLink = `https://bakong.nbc.org.kh/download/?qr=${encodeURIComponent(order.khqr)}`;
      window.open(deepLink, '_blank');
    }
  };

  const handleVerify = async () => {
    if (!order?.id) return;

    if (isManualVerification) {
      toast.info('Please wait for the shop to confirm your payment in their bank app.');
      return;
    }
    
    setStatus('verifying');
    
    try {
      const response = await verifyOrderPayment(order.id);
      setLastCheckedAt(new Date());
      
      if (response.status === 'paid') {
        if (successHandledRef.current) return;
        successHandledRef.current = true;
        setStatus('success');
        toast.success('Payment verified! Your order is being prepared.');
        setTimeout(() => {
          onPaymentSuccess(response);
          onOpenChange(false);
        }, 2000);
      } else {
        setStatus('pending');
        toast.info('Payment not detected yet. Please scan and pay first.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('pending');
      toast.error('Failed to verify payment. Please try again.');
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-none rounded-3xl">
        <div className="bg-red-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <QrCode size={120} />
          </div>
          <DialogTitle className="text-2xl font-black mb-1 flex items-center justify-center gap-2">
            <div className="bg-white p-1 rounded shadow-sm">
              <QrCode className="w-5 h-5 text-red-600" />
            </div>
            KHQR PAY
          </DialogTitle>
          <DialogDescription className="text-red-100 opacity-90">
            Greenvin Coffee • Terminal #01
          </DialogDescription>
        </div>

        <div className="flex flex-col items-center py-6 px-6">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-700">Payment Received!</h3>
                <p className="text-sm text-green-600 mt-2">Processing your order now...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                {/* KHQR Container */}
                <div className="relative w-full max-w-[280px] aspect-square bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 mb-6 flex items-center justify-center">
                  {order.khqr ? (
                    <div className="relative group">
                      <QRCodeCanvas
                        value={order.khqr}
                        size={240}
                        level="H"
                        includeMargin={false}
                        className={status === 'verifying' ? 'opacity-30 blur-sm transition-all' : 'transition-all'}
                      />
                      
                      {status === 'verifying' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-xl">
                          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-2" />
                          <span className="text-xs font-bold text-red-600 uppercase tracking-tighter">Verifying...</span>
                        </div>
                      )}
                      
                      <button 
                        onClick={handleCopy}
                        className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                        title="Copy KHQR string"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                      <span className="text-xs font-medium">Failed to load QR</span>
                    </div>
                  )}
                </div>

                <div className="text-center mb-6">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Total Amount</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-black text-gray-900">${order.totals?.total?.toFixed(2)}</span>
                    <span className="text-sm font-bold text-muted-foreground">USD</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 w-full gap-3 mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl flex items-center justify-between px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all border-gray-200 group"
                    onClick={handleDeepLink}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 group-hover:bg-red-100 rounded-lg transition-colors">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">Pay with Bank App</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-30" />
                  </Button>
                </div>

                <div className="w-full mb-6">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-3">Works with any bank</p>
                  <div className="flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-[8px] text-white font-bold">ABA</div>
                      <span className="text-[8px] font-medium">ABA Bank</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] text-blue-900 font-bold underline">Wing</div>
                      <span className="text-[8px] font-medium">Wing Bank</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white font-bold">ACLEDA</div>
                      <span className="text-[8px] font-medium">ACLEDA</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">...</div>
                      <span className="text-[8px] font-medium">And more</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 w-full opacity-60">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-[11px] text-gray-600 leading-tight">
                      Open any banking app in Cambodia and scan the QR code to pay.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-[11px] text-gray-600 leading-tight">
                      {isManualVerification
                        ? 'Your order is confirmed after the shop sees your payment in their bank app.'
                        : 'Your order is confirmed only after Bakong reports the transaction as paid.'}
                      {lastCheckedAt ? ` Last checked ${lastCheckedAt.toLocaleTimeString()}.` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {status !== 'success' && (
          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl font-bold h-12 text-gray-500 hover:bg-gray-200"
              disabled={status === 'verifying'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleVerify}
              className="flex-[2] bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold h-12 shadow-lg shadow-red-200"
              disabled={status === 'verifying'}
            >
              {status === 'verifying' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                isManualVerification ? 'Waiting for shop confirmation' : 'I have paid'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
