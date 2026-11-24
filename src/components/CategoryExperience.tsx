import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CATEGORIES, CategoryId, PRODUCTS } from '../data/groceries';
import { ProductImage } from './ProductImage';

interface CategoryExperienceProps {
  activeCategory: CategoryId | 'all';
  onShopCategory: (categoryId: CategoryId) => void;
}

export function CategoryExperience({ activeCategory, onShopCategory }: CategoryExperienceProps) {
  const initialIndex =
    activeCategory === 'all'
      ? 0
      : Math.max(
          0,
          CATEGORIES.findIndex((c) => c.id === activeCategory),
        );

  const [selectedId, setSelectedId] = useState<CategoryId>(CATEGORIES[initialIndex].id);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const current = CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];
  const categoryItemsCount = PRODUCTS.filter((p) => p.category === current.id).length;

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -ny * 10,
      ry: nx * 12,
    });
  };

  const handleCardPointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <section
      id="categories"
      style={{
        backgroundColor: current.bgHex,
        color: current.textHex,
      }}
      className="relative py-20 lg:py-28 transition-colors duration-700 ease-out overflow-hidden"
    >
      {/* Fluid ambient spotlight keyed to category accent */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(50% 60% at 80% 35%, ${current.surfaceHex} 0%, transparent 72%)`,
        }}
        className="pointer-events-none absolute inset-0 transition-all duration-700"
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p
              style={{ color: current.mutedTextHex }}
              className="text-xs font-semibold tracking-[0.14em] uppercase mb-3 transition-colors duration-500"
            >
              Curated Aisles · Atmospheric Selection
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.02] text-balance">
              Explore by aisle.
              <br />
              Feel every harvest.
            </h2>
          </div>
          <p
            style={{ color: current.mutedTextHex }}
            className="text-sm sm:text-base max-w-md leading-relaxed transition-colors duration-500"
          >
            Select any department to shift the market mood and jump directly into its freshest
            morning picks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Interactive Category Grid (Left 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3.5 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = cat.id === current.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedId(cat.id)}
                  onMouseEnter={() => setSelectedId(cat.id)}
                  style={{
                    backgroundColor: isSelected ? cat.surfaceHex : 'rgba(255,255,255,0.52)',
                    borderColor: isSelected ? cat.accentHex : 'rgba(16,43,31,0.10)',
                  }}
                  className="group text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#102B1F]"
                >
                  <div className="min-w-0">
                    <span className="block font-display text-base sm:text-lg font-bold tracking-tight truncate">
                      {cat.name}
                    </span>
                    <span
                      style={{ color: isSelected ? cat.accentHex : current.mutedTextHex }}
                      className="mt-1 block text-xs font-medium truncate transition-colors"
                    >
                      {cat.itemCountLabel}
                    </span>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-white/70">
                    <ProductImage
                      src={cat.image}
                      alt={cat.name}
                      fallbackTitle={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3D Tilted Featured Category Spotlight (Right 5 cols) */}
          <div className="lg:col-span-5 flex">
            <div
              onPointerMove={handleCardPointerMove}
              onPointerLeave={handleCardPointerLeave}
              style={{
                transform: `perspective(950px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition:
                  tilt.rx === 0 && tilt.ry === 0
                    ? 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'transform 100ms ease-out',
                backgroundColor: current.surfaceHex,
              }}
              className="w-full rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between border border-[#102B1F]/10 shadow-xl shadow-[#102B1F]/6"
            >
              <div>
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white/60 mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      <ProductImage
                        src={current.image}
                        alt={current.name}
                        fallbackTitle={current.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium opacity-75 mb-2">
                  <span>{current.itemCountLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{categoryItemsCount} curated items</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {current.name}
                    </h3>
                    <p
                      style={{ color: current.accentHex }}
                      className="mt-1 text-sm font-semibold"
                    >
                      {current.tagline}
                    </p>
                    <p
                      style={{ color: current.mutedTextHex }}
                      className="mt-3 text-sm leading-relaxed"
                    >
                      {current.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-7 pt-5 border-t border-[#102B1F]/10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onShopCategory(current.id)}
                  style={{ backgroundColor: current.accentHex }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#102B1F]"
                >
                  <span>Browse {current.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium opacity-70 hidden sm:inline">
                  Same-day chilled slot
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
