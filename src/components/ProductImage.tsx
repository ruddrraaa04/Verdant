import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ProductImage({ src, alt, className = '', fallbackTitle }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EDF2E6] to-[#E2E8D5] text-[#102B1F] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sprout className="w-8 h-8 mb-2 text-[#1F6F3D]" />
        <span className="text-xs font-medium opacity-80 line-clamp-2">{fallbackTitle || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}
