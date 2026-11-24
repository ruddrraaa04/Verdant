import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AccountModal } from './components/AccountModal';
import { CartDrawer, CartItem, PlacedOrder } from './components/CartDrawer';
import { CategoryExperience } from './components/CategoryExperience';
import { DailyDeals } from './components/DailyDeals';
import { FreshnessPromise } from './components/FreshnessPromise';
import { HeroSection } from './components/HeroSection';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { NewsletterFooter } from './components/NewsletterFooter';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductDiscovery, SortOption } from './components/ProductDiscovery';
import { SearchModal } from './components/SearchModal';
import { CategoryId, DiscoveryTab, Product } from './data/groceries';

const STORAGE_CART_KEY = 'verdant_cart_v1';
const STORAGE_WISHLIST_KEY = 'verdant_wishlist_v1';
const STORAGE_ORDERS_KEY = 'verdant_orders_v1';

export default function App() {
  const [appReady, setAppReady] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WISHLIST_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['alphonso-mangoes', 'brown-bread'];
    } catch {
      return ['alphonso-mangoes', 'brown-bread'];
    }
  });

  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      return saved ? (JSON.parse(saved) as PlacedOrder[]) : [];
    } catch {
      return [];
    }
  });

  // Storefront filter state
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [discountedOnly, setDiscountedOnly] = useState(false);

  // Overlays state
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Feedback state
  const [cartBumpKey, setCartBumpKey] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2400);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item,
          );
        }
        return [...prev, { product, quantity: qty }];
      });
      setCartBumpKey((k) => k + 1);
      showToast(`Added ${qty > 1 ? `${qty} × ` : ''}${product.name} to basket`);
    },
    [showToast],
  );

  const handleUpdateQty = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const handleOrderPlaced = useCallback((order: PlacedOrder) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToCategory = (categoryId: CategoryId) => {
    setActiveTab('all');
    setActiveCategory(categoryId);
    setDiscountedOnly(false);
    scrollToSection('shop');
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#102B1F]">
      {!appReady && <LoadingScreen onComplete={() => setAppReady(true)} />}

      <Navbar
        cartCount={totalCartItems}
        cartBumpKey={cartBumpKey}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <main>
        <HeroSection
          onShopNow={() => scrollToSection('shop')}
          onExploreFresh={() => scrollToSection('categories')}
        />

        <CategoryExperience
          activeCategory={activeCategory}
          onShopCategory={handleJumpToCategory}
        />

        <ProductDiscovery
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          discountedOnly={discountedOnly}
          onDiscountedOnlyChange={setDiscountedOnly}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onOpenDetail={setSelectedProduct}
        />

        <DailyDeals onAddToCart={handleAddToCart} onOpenDetail={setSelectedProduct} />

        <FreshnessPromise />
      </main>

      <NewsletterFooter onSelectCategory={handleJumpToCategory} />

      {/* Overlays & Drawers */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={setSelectedProduct}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        orders={orders}
      />

      {/* Non-intrusive Add-to-Cart Confirmation Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[95] px-4 py-3 rounded-full bg-[#102B1F] text-[#F8F7F2] shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-[#9BE63C] shrink-0" />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="ml-1 text-[#9BE63C] font-bold underline underline-offset-2 cursor-pointer"
            >
              View Basket
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
