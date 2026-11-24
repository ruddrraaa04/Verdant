import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, ShieldCheck, ShoppingBasket, Sparkles, Truck } from 'lucide-react';
import { ProductImage } from './ProductImage';

gsap.registerPlugin(ScrollTrigger);

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Browse your favourites',
    detail:
      'Explore orchard fruits, morning-cut greens, small-batch dairy, and stone-baked loaves curated by harvest.',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'Add them to your basket',
    detail:
      'Adjust weights and quantities smoothly, apply harvest codes, and pack plastic-free insulated crates.',
    icon: ShoppingBasket,
  },
  {
    step: '03',
    title: 'Get fresh groceries delivered',
    detail:
      'Temperature-controlled riders bring chilled produce straight to your doorstep within 90 minutes.',
    icon: Truck,
  },
];

const WHY_CHOOSE_US = [
  {
    title: 'Fresh quality products',
    detail: 'Harvested within 24–48 hours and chilled end-to-end without chemical ripening.',
  },
  {
    title: 'Convenient shopping',
    detail: 'Effortless category discovery, instant search, and one-tap basket adjustments.',
  },
  {
    title: 'Transparent pricing',
    detail: 'Honest farm-gate ₹ pricing, clear weight breakdown, and zero hidden packing fees.',
  },
  {
    title: 'Reliable delivery',
    detail: 'Precision 90-minute express or scheduled morning slots with zero-plastic crates.',
  },
];

export function FreshnessPromise() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.freshness-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      gsap.to('.freshness-float-card', {
        y: -26,
        ease: 'none',
        scrollTrigger: {
          trigger: '.freshness-visual-stage',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setParallax({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 18,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 14,
    });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#102B1F] text-[#F8F7F2] py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Freshness Promise Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 freshness-reveal">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#9BE63C] mb-4">
              <Leaf className="w-4 h-4" />
              <span>Interactive Freshness Standard</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.98] text-balance">
              FRESHNESS YOU CAN TASTE.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#F8F7F2]/80 leading-relaxed max-w-[48ch]">
              Every leaf, berry, and loaf moves through a closed cold chain from partner orchards
              and bakehouses directly to your kitchen counter—never warehoused for days under
              harsh supermarket lighting.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-white/12">
              <div>
                <span className="block font-display text-3xl font-extrabold text-[#9BE63C] tabular-nums">
                  4°C
                </span>
                <span className="mt-1 block text-xs sm:text-sm text-[#F8F7F2]/70">
                  Chilled dairy &amp; berry transit
                </span>
              </div>
              <div>
                <span className="block font-display text-3xl font-extrabold text-[#F4D03F] tabular-nums">
                  0%
                </span>
                <span className="mt-1 block text-xs sm:text-sm text-[#F8F7F2]/70">
                  Synthetic carbide or wax coatings
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Layered Produce Collage with Cursor + Scroll Parallax */}
          <div
            onPointerMove={handleStageMove}
            onPointerLeave={() => setParallax({ x: 0, y: 0 })}
            className="lg:col-span-6 freshness-visual-stage relative h-[400px] sm:h-[460px] rounded-[2rem] bg-[#183D2C] border border-white/10 p-6 overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#9BE63C]/15 blur-3xl"
            />
            {/* Back photo */}
            <div
              style={{
                transform: `translate3d(${parallax.x * -0.5}px, ${parallax.y * -0.5}px, 0)`,
                transition: 'transform 220ms ease-out',
              }}
              className="absolute top-6 left-6 right-16 bottom-16 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <ProductImage
                src="/assets/aistudio/TOMATOES_e3765e75.jpg"
                alt="Farm fresh vine tomatoes"
                fallbackTitle="Farm Fresh Vine Tomatoes"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating foreground produce cutouts */}
            <div
              style={{
                transform: `translate3d(${parallax.x * 0.85}px, ${parallax.y * 0.85}px, 0)`,
                transition: 'transform 180ms ease-out',
              }}
              className="freshness-float-card absolute bottom-5 right-5 w-44 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#9BE63C]/70 bg-[#F8F7F2]"
            >
              <ProductImage
                src="/assets/aistudio/STRAWBERRY_1423f983.jpg"
                alt="Fresh Mahabaleshwar strawberry"
                fallbackTitle="Fresh Strawberries"
                className="w-full h-full object-cover"
              />
            </div>

            <div
              style={{
                transform: `translate3d(${parallax.x * 0.45}px, ${parallax.y * 0.55}px, 0)`,
                transition: 'transform 200ms ease-out',
              }}
              className="absolute top-5 right-5 w-28 sm:w-36 aspect-square rounded-2xl overflow-hidden shadow-xl border border-white/20"
            >
              <ProductImage
                src="/assets/aistudio/SPINACH_359dd13e.jpg"
                alt="Crisp fresh spinach leaves"
                fallbackTitle="Fresh Spinach"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 pt-16 border-t border-white/12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 freshness-reveal">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#9BE63C] mb-2">
                How It Works
              </p>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                Three effortless steps from harvest to home.
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="freshness-reveal rounded-2xl bg-[#183D2C]/80 border border-white/10 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-sm font-semibold text-[#9BE63C] tabular-nums">
                        {item.step}.
                      </span>
                      <span className="w-10 h-10 rounded-full bg-[#9BE63C]/15 text-[#9BE63C] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>
                    <h4 className="font-display text-xl font-bold tracking-tight">{item.title}</h4>
                    <p className="mt-2.5 text-sm text-[#F8F7F2]/75 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 pt-14 border-t border-white/12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#F4D03F] mb-6 freshness-reveal">
            <ShieldCheck className="w-4 h-4" />
            <span>Why Choose Verdant</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((pillar) => (
              <div
                key={pillar.title}
                className="freshness-reveal pt-4 border-t border-white/15"
              >
                <h4 className="font-display text-lg font-bold text-[#F8F7F2]">{pillar.title}</h4>
                <p className="mt-2 text-sm text-[#F8F7F2]/72 leading-relaxed">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
