'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { CITIES } from '@/lib/constants';
import { slugify } from '@/lib/utils';

interface CitySearchProps {
  categorySlug: string;
  categoryDisplay: string;
  variant?: 'hero' | 'section';
}

const popularCities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep'];

export function CitySearch({ categorySlug, categoryDisplay, variant = 'hero' }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = (() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    if (!q) return [];
    const starts: string[] = [];
    const contains: string[] = [];
    for (const c of CITIES) {
      const lower = c.toLocaleLowerCase('tr-TR');
      if (lower.startsWith(q)) starts.push(c);
      else if (lower.includes(q)) contains.push(c);
    }
    return [...starts, ...contains];
  })();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToCity = (city: string) => {
    window.location.href = `/${slugify(city)}-${categorySlug}-firmalari`;
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className={`
          flex items-center gap-3 rounded-2xl transition-all duration-200
          ${isHero
            ? 'bg-white/95 backdrop-blur-sm shadow-2xl shadow-black/10 px-5 py-4'
            : 'bg-brand-bg border-2 border-brand-border focus-within:border-brand-primary px-4 py-3.5'
          }
          ${isOpen && filtered.length > 0 ? 'rounded-b-none' : ''}
        `}>
          <Search size={20} className={isHero ? 'text-gray-400' : 'text-brand-text-muted'} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Şehir ara..."
            className={`
              flex-1 bg-transparent outline-none text-base
              ${isHero
                ? 'text-gray-900 placeholder:text-gray-400'
                : 'text-brand-text placeholder:text-brand-text-muted'
              }
            `}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                isHero
                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
              }`}
            >
              Temizle
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && filtered.length > 0 && (
          <div className={`
            absolute z-50 w-full max-h-64 overflow-y-auto rounded-b-2xl
            ${isHero
              ? 'bg-white shadow-2xl shadow-black/10 border-t border-gray-100'
              : 'bg-brand-bg border-2 border-t-0 border-brand-primary shadow-xl'
            }
          `}>
            {filtered.map((city) => (
              <button
                key={city}
                onClick={() => navigateToCity(city)}
                className={`
                  w-full flex items-center gap-3 px-5 py-3 text-left transition-colors
                  ${isHero
                    ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                    : 'text-brand-text hover:bg-brand-primary/5 hover:text-brand-primary'
                  }
                `}
              >
                <MapPin size={16} className="shrink-0 opacity-50" />
                <span className="flex-1 font-medium text-sm">{city}</span>
                <span className={`text-xs ${isHero ? 'text-gray-400' : 'text-brand-text-muted'}`}>
                  {categoryDisplay}
                </span>
                <ChevronRight size={14} className="opacity-30" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Cities */}
      <div className={`mt-4 flex flex-wrap justify-center gap-2 ${!isHero ? 'gap-2' : ''}`}>
        {popularCities.map((city) => (
          <button
            key={city}
            onClick={() => navigateToCity(city)}
            className={`
              px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${isHero
                ? 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white backdrop-blur-sm'
                : 'bg-brand-surface border border-brand-border text-brand-text-muted hover:border-brand-primary hover:text-brand-primary'
              }
            `}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
