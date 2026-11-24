import { useEffect, useState } from 'react';
import { Check, Clock, Copy, Plus } from 'lucide-react';
import { Product, PRODUCTS } from '../data/groceries';
import { ProductImage } from './ProductImage';

interface DailyDealsProps {
  onAddToCart: (product: Product, qty?: number) => void;
  onOpenDetail: (product: Product) => void;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`;
}

export function DailyDeals({ onAddToCart, onOpenDetail }: DailyDealsProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => getSecondsUntilMidnight());
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft(getSecondsUntilMidnight());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const featuredDeals = PRODUCTS.filter((p) => p.featuredDeal);

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText('FRESH15').catch(() => {});
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <section id="deals" className="py-20 lg:py-24 bg-[#F2EFE6] text-[#102B1F]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Banner Header */}
        <div className="rounded-[2rem] bg-[#102B1F] text-[#F8F7F2] p-6 sm:p-10 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#9BE63C] mb-2">
              Daily Harvest Pricing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
              Today&apos;s Orchard &amp; Farm Deals.
            </h2>
            <p className="mt-2 text-sm text-[#F8F7F2]/75 max-w-xl">
              Direct morning surpluses passed straight to your basket—updated once every 24 hours at
              midnight.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-[#183D2C] border border-white/10">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#F8F7F2]/65 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#F4D03F]" />
                <span>Today&apos;s batch ends in</span>
              </div>
              <div className="font-mono text-lg sm:text-xl font-semibold text-[#F4D03F] tabular-nums">
                {formatHMS(secondsLeft)}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyPromo}
              className="px-5 py-3.5 rounded-2xl bg-[#9BE63C] text-[#102B1F] hover:bg-[#a9ec52] transition-colors flex items-center gap-2.5 text-sm font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied FRESH15' : 'Code: FRESH15 (15% Off)'}</span>
            </button>
          </div>
        </div>

        {/* 4 Featured Deal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDeals.map((deal) => (
            <article
              key={deal.id}
              onClick={() => onOpenDetail(deal)}
              className="group rounded-[1.5rem] bg-white border border-[#102B1F]/10 p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <div>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F8F7F2] mb-4">
                  <ProductImage
                    src={deal.image}
                    alt={deal.name}
                    fallbackTitle={deal.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {deal.discountPercent && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#E85D04] text-white text-[11px] font-bold tabular-nums">
                      Save {deal.discountPercent}%
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#1F6F3D] font-medium mb-1">
                  {deal.dealWindowNote || deal.categoryLabel}
                </div>
                <h3 className="font-display text-lg font-bold text-[#102B1F] leading-snug">
                  {deal.name}
                </h3>
                <p className="mt-1 text-xs text-[#102B1F]/60">{deal.weight}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#102B1F]/8 flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-extrabold text-[#102B1F] tabular-nums">
                    ₹{deal.price}
                  </span>
                  {deal.originalPrice && (
                    <span className="text-xs text-[#102B1F]/45 line-through tabular-nums">
                      ₹{deal.originalPrice}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(deal, 1);
                  }}
                  aria-label={`Add ${deal.name} deal to cart`}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#9BE63C]" />
                  <span>Add</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
