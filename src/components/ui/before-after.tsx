'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface BeforeAfterProps {
  beforeUrl: string;
  afterUrl: string;
  className?: string;
}

export function BeforeAfterSlider({ beforeUrl, afterUrl, className = '' }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) updatePosition(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* Transformation badge */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-white/50">
        <Sparkles size={12} className="text-amber-500" />
        <span className="text-[10px] font-semibold text-gray-700 tracking-wide uppercase">
          Dönüşüm
        </span>
        <Sparkles size={12} className="text-amber-500" />
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-col-resize"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* After image (full background) */}
        <div className="absolute inset-0">
          <Image
            src={afterUrl}
            alt="Sonra"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>

        {/* Before image (clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div className="relative w-full h-full" style={{ width: `${10000 / position}%` }}>
            <Image
              src={beforeUrl}
              alt="Önce"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-white shadow-lg" />
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
              <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-2 left-3 z-10">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/80 text-white backdrop-blur-sm uppercase tracking-wider">
            Önce
          </span>
        </div>
        <div className="absolute bottom-2 right-3 z-10">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/80 text-white backdrop-blur-sm uppercase tracking-wider">
            Sonra
          </span>
        </div>
      </div>
    </div>
  );
}

/** Simple side-by-side view for photo galleries */
export function BeforeAfterGrid({
  beforeUrls,
  afterUrls,
}: {
  beforeUrls: string[];
  afterUrls: string[];
}) {
  if (beforeUrls.length === 0 && afterUrls.length === 0) return null;

  // If we have both before and after, show the slider for first pair
  const hasComparison = beforeUrls.length > 0 && afterUrls.length > 0;

  return (
    <div className="space-y-3">
      {hasComparison && (
        <BeforeAfterSlider
          beforeUrl={beforeUrls[0]}
          afterUrl={afterUrls[0]}
        />
      )}

      {/* Extra photos as thumbnails */}
      {(beforeUrls.length > 1 || afterUrls.length > 1 || !hasComparison) && (
        <div className="flex flex-wrap gap-2">
          {beforeUrls.slice(hasComparison ? 1 : 0).map((url, i) => (
            <div key={`b-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-brand-border">
              <Image src={url} alt={`Önce ${i + 1}`} fill className="object-cover" sizes="64px" />
              <div className="absolute bottom-0 inset-x-0 bg-red-500/70 text-center">
                <span className="text-[8px] font-semibold text-white uppercase">Önce</span>
              </div>
            </div>
          ))}
          {afterUrls.slice(hasComparison ? 1 : 0).map((url, i) => (
            <div key={`a-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-brand-border">
              <Image src={url} alt={`Sonra ${i + 1}`} fill className="object-cover" sizes="64px" />
              <div className="absolute bottom-0 inset-x-0 bg-emerald-500/70 text-center">
                <span className="text-[8px] font-semibold text-white uppercase">Sonra</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
