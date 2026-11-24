import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReduced ? 150 : 850;
    const timer = window.setTimeout(() => {
      setVisible(false);
      onComplete();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#102B1F] text-[#F8F7F2]"
          aria-label="Loading Verdant"
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-16 h-16 flex items-center justify-center"
            >
              {/* Minimal animated botanical citrus & basket mark */}
              <svg
                viewBox="0 0 64 64"
                className="w-16 h-16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M22 24C22 15 26.5 10 32 10C37.5 10 42 15 42 24"
                  stroke="#9BE63C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                />
                <motion.path
                  d="M12 24H52L47 50C46.5 52.8 44 54.5 41.2 54.5H22.8C20 54.5 17.5 52.8 17 50L12 24Z"
                  stroke="#F8F7F2"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                />
                <motion.circle
                  cx="32"
                  cy="38"
                  r="6"
                  fill="#9BE63C"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.15, 1] }}
                  transition={{ duration: 0.45, delay: 0.25 }}
                />
                <motion.path
                  d="M32 30C35 26 40 26 41 29C38 31 35 31 32 30Z"
                  fill="#F4D03F"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.35 }}
                />
              </svg>
            </motion.div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-display text-xl font-bold tracking-tight text-[#F8F7F2]">
                Verdant
              </span>
              <span className="text-xs tracking-wide text-[#9BE63C]/85">
                Preparing today&apos;s harvest
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
