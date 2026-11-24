import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Product, PRODUCTS } from '../data/groceries';
import { ProductImage } from './ProductImage';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, qty?: number) => void;
}

const POPULAR_TERMS = ['Mangoes', 'Spinach', 'Eggs', 'Brown Bread', 'Almonds', 'Orange Juice'];

export function SearchModal({
  open,
  onClose,
  onSelectProduct,
  onAddToCart,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] bg-[#102B1F]/50 flex items-start justify-center pt-16 sm:pt-24 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search groceries"
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-[#F8F7F2] text-[#102B1F] shadow-2xl overflow-hidden border border-[#102B1F]/10"
          >
            {/* Input Row */}
            <div className="p-4 sm:p-5 border-b border-[#102B1F]/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#102B1F]/50 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fresh fruits, vegetables, dairy, sourdough..."
                className="flex-1 bg-transparent text-base text-[#102B1F] placeholder:text-[#102B1F]/45 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="w-9 h-9 rounded-full hover:bg-[#102B1F]/8 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Popular search quick buttons */}
            <div className="px-5 py-3 bg-[#EFECE3]/60 border-b border-[#102B1F]/10 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-medium text-[#102B1F]/55 shrink-0">Popular:</span>
              {POPULAR_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1 rounded-full bg-white border border-[#102B1F]/10 text-xs font-medium text-[#102B1F] hover:border-[#102B1F]/35 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto divide-y divide-[#102B1F]/8">
              {results.length === 0 ? (
                <div className="p-10 text-center text-sm text-[#102B1F]/65">
                  No groceries matched &ldquo;{query}&rdquo;.
                </div>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#EFECE3] shrink-0">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          fallbackTitle={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-bold text-[#102B1F] truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#102B1F]/60">
                          {product.categoryLabel} · {product.weight}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-display text-sm font-extrabold tabular-nums">
                        ₹{product.price}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product, 1);
                        }}
                        aria-label={`Add ${product.name} to cart`}
                        className="w-8 h-8 rounded-full bg-[#102B1F] text-[#9BE63C] hover:bg-[#183D2C] flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
