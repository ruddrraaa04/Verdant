import { useMemo } from 'react';
import { ArrowUpDown, Search, Tag, X } from 'lucide-react';
import {
  CATEGORIES,
  CategoryId,
  DiscoveryTab,
  Product,
  PRODUCTS,
} from '../data/groceries';
import { ProductCard } from './ProductCard';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount';

interface ProductDiscoveryProps {
  activeTab: DiscoveryTab;
  onTabChange: (tab: DiscoveryTab) => void;
  activeCategory: CategoryId | 'all';
  onCategoryChange: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  discountedOnly: boolean;
  onDiscountedOnlyChange: (val: boolean) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, qty?: number) => void;
  onOpenDetail: (product: Product) => void;
}

const DISCOVERY_TABS: Array<{ id: DiscoveryTab; label: string }> = [
  { id: 'all', label: 'All Groceries' },
  { id: 'best-sellers', label: 'Best Sellers' },
  { id: 'fresh-arrivals', label: 'Fresh Arrivals' },
  { id: 'todays-deals', label: "Today's Deals" },
  { id: 'recommended', label: 'Recommended for You' },
];

export function ProductDiscovery({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  discountedOnly,
  onDiscountedOnlyChange,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenDetail,
}: ProductDiscoveryProps) {
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (activeTab !== 'all' && !p.collections.includes(activeTab)) return false;
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (discountedOnly && !p.discountPercent) return false;
      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'discount')
      sorted.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

    return sorted;
  }, [activeTab, activeCategory, searchQuery, sortBy, discountedOnly]);

  const hasActiveFilters =
    activeTab !== 'all' ||
    activeCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    discountedOnly;

  const resetFilters = () => {
    onTabChange('all');
    onCategoryChange('all');
    onSearchChange('');
    onDiscountedOnlyChange(false);
    onSortChange('featured');
  };

  return (
    <section id="shop" className="py-20 lg:py-28 bg-[#F8F7F2] text-[#102B1F]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1F6F3D] mb-2">
              Market Shelf · Live Inventory
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.02] text-balance">
              Fresh picks for your daily table.
            </h2>
          </div>

          <div className="text-sm text-[#102B1F]/70 tabular-nums">
            Showing <strong className="text-[#102B1F]">{filteredProducts.length}</strong> of{' '}
            {PRODUCTS.length} essentials
          </div>
        </div>

        {/* Discovery Collection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-[#EFECE3]">
            {DISCOVERY_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#102B1F] ${
                    active
                      ? 'bg-[#102B1F] text-[#F8F7F2] shadow-xs'
                      : 'text-[#102B1F]/70 hover:text-[#102B1F]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Category Filter, Discount Toggle & Price Sort Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#102B1F]/10">
          {/* Search + Category select */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#102B1F]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search mangoes, spinach, sourdough..."
                aria-label="Search products"
                className="w-full h-11 pl-10 pr-9 rounded-full bg-white border border-[#102B1F]/15 text-sm text-[#102B1F] placeholder:text-[#102B1F]/45 focus:outline-none focus:border-[#102B1F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#102B1F]/50 hover:text-[#102B1F] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={activeCategory}
              onChange={(e) => onCategoryChange(e.target.value as CategoryId | 'all')}
              aria-label="Filter by category"
              className="h-11 px-4 rounded-full bg-white border border-[#102B1F]/15 text-sm font-medium text-[#102B1F] focus:outline-none focus:border-[#102B1F] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discount filter & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onDiscountedOnlyChange(!discountedOnly)}
              className={`h-11 px-4 rounded-full border text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                discountedOnly
                  ? 'bg-[#9BE63C] border-[#9BE63C] text-[#102B1F]'
                  : 'bg-white border-[#102B1F]/15 text-[#102B1F]/80 hover:border-[#102B1F]/40'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Discounted Only</span>
            </button>

            <div className="relative inline-flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#102B1F]/55 absolute left-3.5 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Sort products"
                className="h-11 pl-9 pr-4 rounded-full bg-white border border-[#102B1F]/15 text-xs sm:text-sm font-semibold text-[#102B1F] focus:outline-none focus:border-[#102B1F] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Savings</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-11 px-4 rounded-full text-xs font-semibold text-[#102B1F]/70 hover:text-[#102B1F] underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 px-6 rounded-3xl bg-[#EFECE3]/60 text-center">
            <p className="font-display text-2xl font-bold text-[#102B1F]">
              No matching groceries found
            </p>
            <p className="mt-2 text-sm text-[#102B1F]/65">
              Try clearing your search or switching back to all categories.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 px-6 py-3 rounded-full bg-[#102B1F] text-[#F8F7F2] text-sm font-semibold cursor-pointer hover:bg-[#183D2C]"
            >
              Show All Groceries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
