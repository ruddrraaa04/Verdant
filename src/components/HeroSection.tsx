import { useState } from 'react';
import { ArrowDownRight, ArrowRight, Leaf, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroScene3D } from './HeroScene3D';
import { MagneticButton } from './MagneticButton';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreFresh: () => void;
}

export function HeroSection({ onShopNow, onExploreFresh }: HeroSectionProps) {
  const [tossFeedback, setTossFeedback] = useState<string | null>(null);

  const handleBasketBounce = (count: number) => {
    const messages = [
      'Hand-picked orchard harvest',
      'Same-morning farm dispatch',
      'Zero plastic produce crates',
      'Chilled from soil to table',
    ];
    setTossFeedback(messages[(count - 1) % messages.length]);
    window.setTimeout(() => {
      setTossFeedback(null);
    }, 2100);
  };

  return (
    <section
      id="home"
      className="relative min-h-[94vh] lg:min-h-screen pt-[72px] overflow-hidden flex items-center bg-[#F8F7F2]"
    >
      {/* Subtle atmospheric ambient gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(62% 58% at 72% 46%, rgba(155, 230, 60, 0.22) 0%, rgba(244, 208, 63, 0.10) 45%, rgba(248, 247, 242, 0) 80%), radial-gradient(42% 45% at 15% 82%, rgba(16, 43, 31, 0.06) 0%, rgba(248, 247, 242, 0) 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* Left Editorial Typography & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1F6F3D] mb-5">
            <Truck className="w-4 h-4 shrink-0" />
            <span>Freshness delivered to your door</span>
            <span aria-hidden="true" className="text-[#102B1F]/30">
              ·
            </span>
            <span className="text-[#102B1F]/70">90-min chilled dispatch</span>
          </div>

          <h1 className="font-display font-extrabold tracking-[-0.03em] leading-[0.94] text-[#102B1F] text-[clamp(2.85rem,5.4vw,5.1rem)] text-balance">
            GOOD FOOD.
            <br />
            <span className="text-[#183D2C]">BETTER EVERY DAY.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#102B1F]/75 max-w-[46ch]">
            Fresh groceries, everyday essentials, and everything you love — delivered straight to
            your doorstep.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton
              type="button"
              onClick={onShopNow}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#102B1F] text-[#F8F7F2] hover:bg-[#183D2C] font-semibold text-sm tracking-wide transition-colors shadow-lg shadow-[#102B1F]/15 whitespace-nowrap shrink-0"
            >
              <span>SHOP NOW</span>
              <span className="w-6 h-6 rounded-full bg-[#9BE63C] text-[#102B1F] flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </MagneticButton>

            <MagneticButton
              type="button"
              onClick={onExploreFresh}
              strength={0.18}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#102B1F]/20 bg-[#F8F7F2] hover:border-[#102B1F]/45 text-[#102B1F] font-semibold text-sm tracking-wide transition-colors whitespace-nowrap shrink-0"
            >
              <span>EXPLORE FRESH PICKS</span>
              <ArrowDownRight className="w-4 h-4 text-[#1F6F3D]" />
            </MagneticButton>
          </div>

          <div className="mt-10 pt-6 border-t border-[#102B1F]/10 w-full max-w-md flex items-center justify-between gap-4 text-xs text-[#102B1F]/65">
            <div>
              <span className="block font-display text-lg font-bold text-[#102B1F] tabular-nums">
                48 hrs
              </span>
              <span>Soil to doorstep window</span>
            </div>
            <div className="h-8 w-px bg-[#102B1F]/10" />
            <div>
              <span className="block font-display text-lg font-bold text-[#102B1F] tabular-nums">
                100%
              </span>
              <span>Residue-tested produce</span>
            </div>
            <div className="h-8 w-px bg-[#102B1F]/10" />
            <div>
              <span className="block font-display text-lg font-bold text-[#102B1F] tabular-nums">
                ₹499+
              </span>
              <span>Complimentary delivery</span>
            </div>
          </div>
        </motion.div>

        {/* Right Interactive 3D Floating Grocery Basket */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative h-[410px] sm:h-[500px] lg:h-[600px] w-full flex items-center justify-center"
        >
          <HeroScene3D onBasketBounce={handleBasketBounce} />

          {/* Subtle non-intrusive interaction caption below the 3D stage */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-[#102B1F]/65 whitespace-nowrap bg-[#F8F7F2]/85 px-3.5 py-1.5 rounded-full border border-[#102B1F]/10">
            <Leaf className="w-3.5 h-3.5 text-[#1F6F3D]" />
            <span>{tossFeedback || 'Move cursor to tilt · Click basket to toss'}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
