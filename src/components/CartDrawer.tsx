import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  FREE_DELIVERY_THRESHOLD,
  PROMO_CODES,
  PromoCode,
  Product,
  STANDARD_DELIVERY_FEE,
} from '../data/groceries';
import { ProductImage } from './ProductImage';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PlacedOrder {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  itemsCount: number;
  total: number;
  placedAt: string;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: PlacedOrder) => void;
}

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD' | 'Card'>('UPI');
  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee =
    items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  let discountAmount = 0;
  if (appliedPromo && subtotal >= appliedPromo.minOrder) {
    discountAmount =
      appliedPromo.type === 'percent'
        ? Math.round((subtotal * appliedPromo.value) / 100)
        : appliedPromo.value;
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const amountForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const found = PROMO_CODES.find((p) => p.code === code);
    if (!found) {
      setPromoError('Invalid code. Try FRESH15 or VERDANT100.');
      return;
    }
    if (subtotal < found.minOrder) {
      setPromoError(`${found.code} requires a minimum basket of ₹${found.minOrder}.`);
      return;
    }
    setAppliedPromo(found);
    setPromoError(null);
    setPromoInput('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      customerName.trim().length < 2 ||
      phone.trim().length < 8 ||
      address.trim().length < 6 ||
      pincode.trim().length < 5
    ) {
      setFormError('Please enter your name, phone, delivery address, and postal code.');
      return;
    }

    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    const newOrder: PlacedOrder = {
      orderId: `VRD-${Math.floor(1000 + Math.random() * 8999)}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: `${address.trim()}, ${pincode.trim()}`,
      paymentMethod,
      itemsCount: totalItems,
      total: finalTotal,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedOrder(newOrder);
    onOrderPlaced(newOrder);
    onClearCart();
    setAppliedPromo(null);
    setFormError(null);
    setStep('confirmed');
  };

  const handleClose = () => {
    onClose();
    if (step === 'confirmed') {
      window.setTimeout(() => setStep('cart'), 250);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={handleClose}
          className="fixed inset-0 z-[80] bg-[#102B1F]/45 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart drawer"
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#F8F7F2] text-[#102B1F] h-full flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#102B1F]/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {step === 'checkout' && (
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    aria-label="Back to basket"
                    className="w-9 h-9 rounded-full hover:bg-[#102B1F]/8 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <ShoppingBag className="w-5 h-5 text-[#1F6F3D]" />
                <h2 className="font-display text-xl font-extrabold tracking-tight">
                  {step === 'cart' && 'Your Fresh Basket'}
                  {step === 'checkout' && 'Delivery Checkout'}
                  {step === 'confirmed' && 'Order Confirmed'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close cart drawer"
                className="w-10 h-10 rounded-full hover:bg-[#102B1F]/8 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {step === 'confirmed' && confirmedOrder ? (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9BE63C] text-[#102B1F] flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#1F6F3D] uppercase tracking-wider">
                  Order #{confirmedOrder.orderId} Confirmed
                </span>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-[#102B1F]">
                  Preparing Chilled Dispatch
                </h3>
                <p className="mt-2 text-sm text-[#102B1F]/70 max-w-xs">
                  Thank you, {confirmedOrder.customerName}. Your {confirmedOrder.itemsCount} fresh
                  items are being packed in insulated crates.
                </p>

                <div className="mt-6 w-full rounded-2xl bg-white border border-[#102B1F]/10 p-5 text-left text-sm space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-[#102B1F]/60">Deliver to</span>
                    <span className="font-medium text-right max-w-[60%]">
                      {confirmedOrder.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#102B1F]/60">Payment</span>
                    <span className="font-medium">{confirmedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-[#102B1F]/10 font-bold">
                    <span>Total Amount</span>
                    <span className="tabular-nums">₹{confirmedOrder.total}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep('cart');
                    onClose();
                  }}
                  className="mt-7 w-full py-3.5 rounded-full bg-[#102B1F] text-[#F8F7F2] font-semibold text-sm cursor-pointer hover:bg-[#183D2C]"
                >
                  Continue Shopping
                </button>
              </div>
            ) : step === 'checkout' ? (
              <form
                onSubmit={handlePlaceOrder}
                className="flex-1 overflow-y-auto p-6 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <p className="text-xs text-[#102B1F]/65">
                    Same-day 90-minute chilled delivery · Free above ₹{FREE_DELIVERY_THRESHOLD}
                  </p>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" htmlFor="chk-name">
                      Full Name
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className="w-full h-11 px-4 rounded-xl bg-white border border-[#102B1F]/15 text-sm focus:outline-none focus:border-[#102B1F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" htmlFor="chk-phone">
                        Phone Number
                      </label>
                      <input
                        id="chk-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 px-4 rounded-xl bg-white border border-[#102B1F]/15 text-sm focus:outline-none focus:border-[#102B1F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" htmlFor="chk-pin">
                        Postal Code
                      </label>
                      <input
                        id="chk-pin"
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="400001"
                        className="w-full h-11 px-4 rounded-xl bg-white border border-[#102B1F]/15 text-sm focus:outline-none focus:border-[#102B1F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" htmlFor="chk-address">
                      Delivery Address
                    </label>
                    <textarea
                      id="chk-address"
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat 402, Palm Grove, Bandra West"
                      className="w-full p-3.5 rounded-xl bg-white border border-[#102B1F]/15 text-sm focus:outline-none focus:border-[#102B1F]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold mb-2">Payment Method</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['UPI', 'COD', 'Card'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                            paymentMethod === method
                              ? 'bg-[#102B1F] text-[#F8F7F2] border-[#102B1F]'
                              : 'bg-white text-[#102B1F] border-[#102B1F]/15'
                          }`}
                        >
                          {method === 'COD' ? 'Cash on Delivery' : method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formError && <p className="text-xs font-medium text-[#DC2626]">{formError}</p>}
                </div>

                <div className="pt-4 border-t border-[#102B1F]/10 space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Payable Total</span>
                    <span className="tabular-nums">₹{finalTotal}</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C] font-semibold text-sm cursor-pointer transition-colors"
                  >
                    Confirm Order · ₹{finalTotal}
                  </button>
                </div>
              </form>
            ) : items.length === 0 ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#EFECE3] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 text-[#102B1F]/50" />
                </div>
                <h3 className="font-display text-xl font-bold">Your basket is empty</h3>
                <p className="mt-2 text-sm text-[#102B1F]/65 max-w-xs">
                  Add orchard fruits, leafy greens, or stone-baked bread to begin your harvest
                  delivery.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 px-6 py-3 rounded-full bg-[#102B1F] text-[#F8F7F2] text-sm font-semibold cursor-pointer hover:bg-[#183D2C]"
                >
                  Browse Fresh Groceries
                </button>
              </div>
            ) : (
              <>
                {/* Free delivery progress bar */}
                <div className="px-6 py-3.5 bg-[#EFECE3]/70 border-b border-[#102B1F]/10">
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#1F6F3D]" />
                      {amountForFreeDelivery === 0
                        ? 'Complimentary chilled delivery unlocked'
                        : `Add ₹${amountForFreeDelivery} more for free delivery`}
                    </span>
                    <span className="tabular-nums text-[#102B1F]/65">
                      ₹{subtotal} / ₹{FREE_DELIVERY_THRESHOLD}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#102B1F]/10 overflow-hidden">
                    <div
                      style={{ width: `${freeDeliveryProgress}%` }}
                      className="h-full bg-[#1F6F3D] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#102B1F]/10">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="py-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EFECE3] shrink-0">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          fallbackTitle={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-bold text-[#102B1F] truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#102B1F]/55">{product.weight}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-full border border-[#102B1F]/15 bg-white">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(product.id, -1)}
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#EFECE3] rounded-l-full cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(product.id, 1)}
                              aria-label={`Increase quantity of ${product.name}`}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#EFECE3] rounded-r-full cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            aria-label={`Remove ${product.name}`}
                            className="p-1.5 text-[#102B1F]/45 hover:text-[#DC2626] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-display text-sm font-extrabold tabular-nums">
                          ₹{product.price * quantity}
                        </span>
                        {product.originalPrice && (
                          <span className="block text-[11px] text-[#102B1F]/45 line-through tabular-nums">
                            ₹{product.originalPrice * quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code + Totals Footer */}
                <div className="px-6 py-5 bg-white border-t border-[#102B1F]/10 space-y-4">
                  {/* Discount Code Input */}
                  {appliedPromo ? (
                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#E9F5E8] text-[#1F6F3D] text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {appliedPromo.code} applied ({appliedPromo.label})
                      </span>
                      <button
                        type="button"
                        onClick={() => setAppliedPromo(null)}
                        className="underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError(null);
                        }}
                        placeholder="Promo code (try FRESH15)"
                        aria-label="Discount code"
                        className="flex-1 h-10 px-3.5 rounded-xl bg-[#F8F7F2] border border-[#102B1F]/15 text-xs focus:outline-none focus:border-[#102B1F]"
                      />
                      <button
                        type="submit"
                        className="px-4 h-10 rounded-xl bg-[#EFECE3] hover:bg-[#e4dfd2] text-xs font-semibold text-[#102B1F] cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {promoError && <p className="text-xs text-[#DC2626] font-medium">{promoError}</p>}

                  {/* Breakdown */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-[#102B1F]/70">
                      <span>Subtotal</span>
                      <span className="tabular-nums font-medium text-[#102B1F]">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#102B1F]/70">
                      <span>Delivery Charge</span>
                      <span className="tabular-nums font-medium text-[#102B1F]">
                        {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#1F6F3D] font-medium">
                        <span>Promo Discount</span>
                        <span className="tabular-nums">-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2.5 border-t border-[#102B1F]/10 font-display text-lg font-extrabold">
                      <span>Total</span>
                      <span className="tabular-nums">₹{finalTotal}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-4 rounded-full bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C] font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Proceed to Checkout · ₹{finalTotal}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
