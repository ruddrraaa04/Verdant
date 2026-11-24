import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CATEGORIES, CategoryId, FAQS } from '../data/groceries';

interface NewsletterFooterProps {
  onSelectCategory: (id: CategoryId) => void;
}

type InfoTopic = 'faqs' | 'delivery' | 'privacy' | 'contact' | null;

export function NewsletterFooter({ onSelectCategory }: NewsletterFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<InfoTopic>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(null);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="py-20 lg:py-24 bg-[#F8F7F2] text-[#102B1F] border-t border-[#102B1F]/10">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="rounded-[2.25rem] bg-[#9BE63C] text-[#102B1F] p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#102B1F]/75 mb-3">
                <Mail className="w-4 h-4" />
                <span>Weekly Harvest Notes</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.02] text-balance">
                A LITTLE FRESHNESS IN YOUR INBOX.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#102B1F]/80 max-w-lg">
                First access to seasonal Ratnagiri mango crates, bakehouse drops, and weekend
                farmer market bundles.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-5 rounded-2xl bg-[#102B1F] text-[#F8F7F2] flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#9BE63C] shrink-0" />
                  <div>
                    <p className="font-display font-bold text-base">
                      You&apos;re on the harvest list.
                    </p>
                    <p className="text-xs text-[#F8F7F2]/75">
                      Use code FRESH15 at checkout for 15% off your first basket.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5" noValidate>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(null);
                      }}
                      placeholder="you@domain.com"
                      aria-label="Email address for newsletter"
                      className="flex-1 h-13 px-5 rounded-full bg-[#F8F7F2] text-[#102B1F] placeholder:text-[#102B1F]/45 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#102B1F]"
                    />
                    <button
                      type="submit"
                      className="h-13 px-7 rounded-full bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4 text-[#9BE63C]" />
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-xs font-semibold text-[#991B1B] pl-3">{emailError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#102B1F] text-[#F8F7F2] pt-16 pb-10">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <a
                href="#home"
                className="font-display text-3xl font-extrabold tracking-tight text-[#F8F7F2]"
              >
                Verdant
              </a>
              <p className="mt-3 text-sm text-[#F8F7F2]/70 max-w-xs leading-relaxed">
                Good food, better every day. Farm-direct produce, morning dairy, and pantry
                essentials delivered chilled in returnable crates.
              </p>
              <div className="mt-6 flex items-center gap-4 text-xs font-medium text-[#9BE63C]">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTopic('contact');
                  }}
                  className="hover:underline"
                >
                  Instagram
                </a>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTopic('contact');
                  }}
                  className="hover:underline"
                >
                  X / Twitter
                </a>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTopic('contact');
                  }}
                  className="hover:underline"
                >
                  YouTube
                </a>
              </div>
            </div>

            {/* Shop Categories */}
            <div className="lg:col-span-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#F8F7F2]/55 mb-4">
                Shop Categories
              </h3>
              <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm text-[#F8F7F2]/80">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => onSelectCategory(cat.id)}
                      className="hover:text-[#9BE63C] transition-colors text-left cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Support */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#F8F7F2]/55 mb-4">
                  Company
                </h3>
                <ul className="space-y-2.5 text-sm text-[#F8F7F2]/80">
                  <li>
                    <a href="#about" className="hover:text-[#9BE63C] transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTopic('contact')}
                      className="hover:text-[#9BE63C] transition-colors cursor-pointer"
                    >
                      Contact
                    </button>
                  </li>
                  <li>
                    <a href="#deals" className="hover:text-[#9BE63C] transition-colors">
                      Daily Deals
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#F8F7F2]/55 mb-4">
                  Help &amp; Care
                </h3>
                <ul className="space-y-2.5 text-sm text-[#F8F7F2]/80">
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTopic('faqs')}
                      className="hover:text-[#9BE63C] transition-colors cursor-pointer"
                    >
                      FAQs
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTopic('delivery')}
                      className="hover:text-[#9BE63C] transition-colors cursor-pointer"
                    >
                      Delivery Information
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTopic('privacy')}
                      className="hover:text-[#9BE63C] transition-colors cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F7F2]/50">
            <p>© {new Date().getFullYear()} Verdant Fresh Market. All rights reserved.</p>
            <p>Chilled same-day grocery delivery · Prices inclusive of taxes</p>
          </div>
        </div>
      </footer>

      {/* Interactive Footer Info Modal */}
      <AnimatePresence>
        {activeTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveTopic(null)}
            className="fixed inset-0 z-[90] bg-[#102B1F]/55 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-[#F8F7F2] text-[#102B1F] p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#102B1F]/10 mb-5">
                <h3 className="font-display text-2xl font-extrabold">
                  {activeTopic === 'faqs' && 'Frequently Asked Questions'}
                  {activeTopic === 'delivery' && 'Delivery Information'}
                  {activeTopic === 'privacy' && 'Privacy Policy'}
                  {activeTopic === 'contact' && 'Contact Verdant'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTopic(null)}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-full hover:bg-[#102B1F]/8 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeTopic === 'faqs' && (
                <div className="space-y-4 text-sm">
                  {FAQS.map((item) => (
                    <div key={item.q} className="pb-4 border-b border-[#102B1F]/8 last:border-0">
                      <p className="font-bold text-[#102B1F]">{item.q}</p>
                      <p className="mt-1 text-[#102B1F]/75 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTopic === 'delivery' && (
                <div className="space-y-3 text-sm text-[#102B1F]/80 leading-relaxed">
                  <p>
                    <strong>Express 90-Minute Chilled Dispatch:</strong> Available daily from 6:30 AM
                    to 9:30 PM across metro pin codes.
                  </p>
                  <p>
                    <strong>Delivery Charges:</strong> Complimentary on orders of ₹499 and above. A
                    flat ₹39 cold-chain handling fee applies to smaller baskets.
                  </p>
                  <p>
                    <strong>Crate Return:</strong> Leave yesterday&apos;s insulated crate by your
                    door during your next drop for sanitising and reuse.
                  </p>
                </div>
              )}

              {activeTopic === 'privacy' && (
                <div className="space-y-3 text-sm text-[#102B1F]/80 leading-relaxed">
                  <p>
                    Verdant collects only the contact and delivery details required to fulfil your
                    grocery orders and freshness updates.
                  </p>
                  <p>
                    Your basket and wishlist preferences remain stored locally in your browser
                    session, and we never sell or broker personal customer records.
                  </p>
                </div>
              )}

              {activeTopic === 'contact' && (
                <div className="space-y-3 text-sm text-[#102B1F]/80 leading-relaxed">
                  <p>
                    <strong>Customer Care:</strong> care@verdantmarket.in · +91 22 4890 3210
                  </p>
                  <p>
                    <strong>Farm Partnerships:</strong> growers@verdantmarket.in
                  </p>
                  <p>
                    <strong>Central Cold Hub:</strong> Unit 14, Lower Parel Harvest Yards, Mumbai
                    400013
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
