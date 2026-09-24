import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal = ({ isOpen, onClose, onConfirm, competition, isRegistering = false }) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('testuser@okhdfcbank');

  const handlePay = async () => {
    try {
      await onConfirm();
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onClose();
    } catch (err) {
      // Error is handled in the screen
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header with Razorpay branding */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">
              ₹
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-200">
                Razorpay Checkout (Simulated)
              </h3>
              <p className="text-sm font-bold">{competition?.title || 'Feedants Competition'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Amount Payable:</span>
          <span className="text-lg font-black text-slate-900">₹{competition?.entryFee || 99}.00</span>
        </div>

        {/* Payment Methods */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <label className="text-xs font-bold text-slate-700 block">Choose Payment Method</label>

          <div className="space-y-2">
            {/* UPI Option */}
            <div
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">UPI / QR (Instant)</span>
              </div>
              <input
                type="radio"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="text-blue-600"
              />
            </div>

            {/* Card Option */}
            <div
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-800">Credit / Debit Card</span>
              </div>
              <input
                type="radio"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="text-blue-600"
              />
            </div>

            {/* Netbanking Option */}
            <div
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'netbanking'
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-800">Net Banking</span>
              </div>
              <input
                type="radio"
                checked={paymentMethod === 'netbanking'}
                onChange={() => setPaymentMethod('netbanking')}
                className="text-blue-600"
              />
            </div>
          </div>

          {paymentMethod === 'upi' && (
            <div className="pt-1">
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Virtual Payment Address (VPA)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 justify-center pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Bank Encryption | Test Mode Enabled</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handlePay}
            disabled={isRegistering}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isRegistering ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Reserving Slot & Processing Payment...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{competition?.entryFee || 99} & Confirm Registration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
