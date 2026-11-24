import { useState } from 'react';
import { Check, Heart, Plus } from 'lucide-react';
import { Product } from '../data/groceries';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, qty?: number) => void;
  onOpenDetail: (product: Product) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenDetail,
}: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <article
      onClick={() => onOpenDetail(product)}
      className="group relative rounded-[1.5rem] bg-[#FFFFFF] border border-[#102B1F]/10 p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#102B1F]/8 hover:bg-[#FCFBF8] cursor-pointer"
    >
      <div>
        {/* Product Photo Frame */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F2EFE6] mb-4">
          <ProductImage
            src={product.image}
            alt={product.name}
            fallbackTitle={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Top subtle overlay controls */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
            {product.discountPercent ? (
              <span className="pointer-events-auto px-2.5 py-1 rounded-md bg-[#102B1F] text-[#9BE63C] text-[11px] font-bold tracking-wide tabular-nums">
                -{product.discountPercent}%
              </span>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              aria-label={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C] ${
                isWishlisted
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-white/90 text-[#102B1F] hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Clean Unboxed Metadata */}
        <div className="flex items-center gap-1.5 text-xs text-[#102B1F]/60 mb-1.5 truncate">
          <span>{product.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.weight}</span>
        </div>

        <h3 className="font-display text-lg font-bold tracking-tight text-[#102B1F] leading-snug line-clamp-1">
          {product.name}
        </h3>
      </div>

      {/* Price & Add to Cart Row */}
      <div className="mt-4 pt-3 border-t border-[#102B1F]/8 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold text-[#102B1F] tabular-nums">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#102B1F]/45 line-through tabular-nums">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C] ${
            justAdded
              ? 'bg-[#9BE63C] text-[#102B1F] scale-95'
              : 'bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C]'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-[#9BE63C]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
