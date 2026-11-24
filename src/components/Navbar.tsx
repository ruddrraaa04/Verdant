import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  cartBumpKey: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#shop' },
  { label: 'Categories', href: '#categories' },
  { label: 'Deals', href: '#deals' },
  { label: 'About', href: '#about' },
];

export function Navbar({
  cartCount,
  cartBumpKey,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-[#F8F7F2]/95 border-b border-[#102B1F]/10 shadow-xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#home"
            className="font-display text-2xl font-extrabold tracking-tight text-[#102B1F] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C] rounded-md"
          >
            Verdant
          </a>

          {/* Zone 2: 5 clean single-line navigation links */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#102B1F]/80"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#102B1F] transition-colors after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-[#102B1F] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C] rounded-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Compact action cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search groceries"
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#102B1F] hover:bg-[#102B1F]/8 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C]"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={onOpenAccount}
              aria-label="Account and saved items"
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#102B1F] hover:bg-[#102B1F]/8 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C]"
            >
              <User className="w-[18px] h-[18px]" />
            </button>

            <motion.button
              key={cartBumpKey}
              type="button"
              onClick={onOpenCart}
              initial={cartBumpKey > 0 ? { scale: 0.92 } : false}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 460, damping: 20 }}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className="inline-flex items-center gap-2.5 h-10 px-4 rounded-full bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C] transition-colors text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C]"
            >
              <ShoppingBag className="w-4 h-4 text-[#9BE63C]" />
              <span>Basket</span>
              <span className="tabular-nums inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#9BE63C] text-[#102B1F] text-[11px] font-bold">
                {cartCount}
              </span>
            </motion.button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full text-[#102B1F] hover:bg-[#102B1F]/8 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-[#102B1F]/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile navigation"
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#F8F7F2] p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#102B1F]/10">
                  <span className="font-display text-xl font-extrabold text-[#102B1F]">
                    Verdant
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#102B1F]/8 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <ul className="mt-6 flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 px-3 rounded-xl font-display text-xl font-semibold text-[#102B1F] hover:bg-[#102B1F]/6 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-[#102B1F]/10 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#EFECE3] text-sm font-semibold text-[#102B1F] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Search Groceries
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#102B1F] text-sm font-semibold text-[#F8F7F2] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#9BE63C]" />
                  Account & Wishlist
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
