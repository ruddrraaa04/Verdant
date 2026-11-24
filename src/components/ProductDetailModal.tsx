import { useEffect, useState } from 'react';
import { Heart, MapPin, Minus, Plus, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Product, PRODUCTS } from '../data/groceries';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, qty: number) => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}: ProductDetailModalProps) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product?.id]);

  if (!product) return null;

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.collections.includes('best-sellers')),
  ).slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[85] bg-[#102B1F]/50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-[2rem] bg-[#F8F7F2] text-[#102B1F] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#102B1F] flex items-center justify-center shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Image Column */}
            <div className="md:col-span-6 bg-[#EFECE3] p-6 flex items-center justify-center">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  fallbackTitle={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Purchase Module Column */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#1F6F3D] mb-2">
                  <span>{product.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.weight}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-2xl font-extrabold tabular-nums">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#102B1F]/45 line-through tabular-nums">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-[#E85D04] tabular-nums">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-[#102B1F]/80 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-5 space-y-2.5 pt-4 border-t border-[#102B1F]/10 text-xs text-[#102B1F]/70">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#1F6F3D] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#102B1F]">Origin:</strong> {product.origin}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1F6F3D] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#102B1F]">Storage:</strong> {product.storageTip}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity & Buy Actions */}
              <div className="mt-6 pt-5 border-t border-[#102B1F]/10 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center h-12 rounded-full border border-[#102B1F]/20 bg-white px-1">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 rounded-full hover:bg-[#EFECE3] flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-9 h-9 rounded-full hover:bg-[#EFECE3] flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, qty);
                    onClose();
                  }}
                  className="flex-1 h-12 px-6 rounded-full bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4 text-[#9BE63C]" />
                  <span>Add · ₹{product.price * qty}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#DC2626] border-[#DC2626] text-white'
                      : 'bg-white border-[#102B1F]/20 text-[#102B1F] hover:border-[#102B1F]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="px-6 sm:px-8 py-6 bg-[#EFECE3]/60 border-t border-[#102B1F]/10">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#102B1F]/65 mb-4">
              Pairs Well With
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onSelectProduct(rel)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#102B1F]/8 hover:border-[#102B1F]/25 transition-colors text-left cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F8F7F2] shrink-0">
                    <ProductImage
                      src={rel.image}
                      alt={rel.name}
                      fallbackTitle={rel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-display text-sm font-bold text-[#102B1F] truncate">
                      {rel.name}
                    </span>
                    <span className="block text-xs text-[#102B1F]/60 tabular-nums">
                      ₹{rel.price} · {rel.weight}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
