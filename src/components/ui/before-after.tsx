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
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-white/50">
        <Sparkles size={10} className="text-amber-500" />
        <span className="text-[9px] font-semibold text-gray-700 tracking-wide uppercase">
          Dönüşüm
        </span>
        <Sparkles size={10} className="text-amber-500" />
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-[3/2] rounded-xl overflow-hidden cursor-col-resize"
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
            sizes="(max-width: 640px) 50vw, 280px"
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
              sizes="(max-width: 640px) 50vw, 280px"
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2.5 bg-gray-400 rounded-full" />
              <div className="w-0.5 h-2.5 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-1.5 left-2 z-10">
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-red-500/80 text-white backdrop-blur-sm uppercase tracking-wider">
            Önce
          </span>
        </div>
        <div className="absolute bottom-1.5 right-2 z-10">
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/80 text-white backdrop-blur-sm uppercase tracking-wider">
            Sonra
          </span>
        </div>
      </div>
    </div>
  );
}

/** Grid of before/after comparisons — shows all pairs as sliders */
export function BeforeAfterGrid({
  beforeUrls,
  afterUrls,
}: {
  beforeUrls: string[];
  afterUrls: string[];
}) {
  if (beforeUrls.length === 0 && afterUrls.length === 0) return null;

  const pairCount = Math.min(beforeUrls.length, afterUrls.length);
  const extraBefore = beforeUrls.slice(pairCount);
  const extraAfter = afterUrls.slice(pairCount);

  return (
    <div className="space-y-2">
      {/* All matched pairs as sliders in a compact grid */}
      {pairCount > 0 && (
        <div className={`grid gap-2 ${pairCount === 1 ? 'grid-cols-1 max-w-[240px]' : 'grid-cols-2 max-w-[480px]'}`}>
          {Array.from({ length: pairCount }).map((_, i) => (
            <BeforeAfterSlider
              key={`pair-${i}`}
              beforeUrl={beforeUrls[i]}
              afterUrl={afterUrls[i]}
            />
          ))}
        </div>
      )}

      {/* Extra photos without a pair — shown as labeled thumbnails */}
      {(extraBefore.length > 0 || extraAfter.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {extraBefore.map((url, i) => (
            <div key={`b-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-brand-border">
              <Image src={url} alt={`Önce ${pairCount + i + 1}`} fill className="object-cover" sizes="80px" />
              <div className="absolute bottom-0 inset-x-0 bg-red-500/70 text-center">
                <span className="text-[8px] font-semibold text-white uppercase">Önce</span>
              </div>
            </div>
          ))}
          {extraAfter.map((url, i) => (
            <div key={`a-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-brand-border">
              <Image src={url} alt={`Sonra ${pairCount + i + 1}`} fill className="object-cover" sizes="80px" />
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
