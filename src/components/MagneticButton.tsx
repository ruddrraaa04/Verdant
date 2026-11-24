import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.28,
  className = '',
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setOffset({
      x: Math.max(-12, Math.min(12, dx * strength)),
      y: Math.max(-10, Math.min(10, dy * strength)),
    });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition:
          offset.x === 0 && offset.y === 0
            ? 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 110ms ease-out',
      }}
      className={`cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE63C] focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
