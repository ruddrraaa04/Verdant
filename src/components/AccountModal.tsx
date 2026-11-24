import { Heart, PackageCheck, Plus, Trash2, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Product, PRODUCTS } from '../data/groceries';
import { PlacedOrder } from './CartDrawer';
import { ProductImage } from './ProductImage';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, qty?: number) => void;
  orders: PlacedOrder[];
}

export function AccountModal({
  open,
  onClose,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  orders,
}: AccountModalProps) {
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] bg-[#102B1F]/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Shopper account and wishlist"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-[2rem] bg-[#F8F7F2] text-[#102B1F] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
          >
            <div className="px-6 py-5 border-b border-[#102B1F]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#102B1F] text-[#9BE63C] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-extrabold leading-tight">
                    My Fresh Pantry
                  </h2>
                  <p className="text-xs text-[#102B1F]/60">
                    Saved wishlist &amp; active harvest orders
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close account modal"
                className="w-10 h-10 rounded-full hover:bg-[#102B1F]/8 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Saved Wishlist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#102B1F]/70 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#DC2626]" />
                    <span>Saved Wishlist ({savedProducts.length})</span>
                  </h3>
                </div>

                {savedProducts.length === 0 ? (
                  <p className="p-4 rounded-2xl bg-[#EFECE3]/70 text-xs text-[#102B1F]/65">
                    Tap the heart icon on any grocery item to save your weekly staples here.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {savedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-white border border-[#102B1F]/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#EFECE3] shrink-0">
                            <ProductImage
                              src={p.image}
                              alt={p.name}
                              fallbackTitle={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-display text-sm font-bold truncate">
                              {p.name}
                            </span>
                            <span className="block text-xs text-[#102B1F]/60 tabular-nums">
                              ₹{p.price} · {p.weight}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => onAddToCart(p, 1)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#102B1F] text-[#F8F7F2] text-xs font-semibold cursor-pointer hover:bg-[#183D2C]"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#9BE63C]" />
                            <span>Add</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(p.id)}
                            aria-label={`Remove ${p.name} from wishlist`}
                            className="p-1.5 text-[#102B1F]/45 hover:text-[#DC2626] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#102B1F]/70 flex items-center gap-2 mb-3">
                  <PackageCheck className="w-4 h-4 text-[#1F6F3D]" />
                  <span>Recent Orders ({orders.length})</span>
                </h3>

                {orders.length === 0 ? (
                  <p className="p-4 rounded-2xl bg-[#EFECE3]/70 text-xs text-[#102B1F]/65">
                    No orders placed in this session yet. Your confirmed deliveries will appear
                    here.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="p-4 rounded-2xl bg-white border border-[#102B1F]/10 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-bold text-sm">
                          <span className="font-mono text-[#1F6F3D]">#{order.orderId}</span>
                          <span className="tabular-nums">₹{order.total}</span>
                        </div>
                        <p className="text-[#102B1F]/70">
                          {order.itemsCount} items · {order.paymentMethod} · Placed at{' '}
                          {order.placedAt}
                        </p>
                        <p className="text-[#102B1F]/55 truncate">{order.address}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
