'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Building2, Search } from 'lucide-react';
import { searchLocations, type LocationItem } from '@/lib/turkey-locations';
import { cn } from '@/lib/utils';

interface CityAutocompleteProps {
  onSelect: (item: LocationItem) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function CityAutocomplete({
  onSelect,
  placeholder = 'Şehir veya ilçe ara...',
  className,
  inputClassName,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    const matches = searchLocations(value, 8);
    setResults(matches);
    setIsOpen(matches.length > 0);
    setActiveIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (item: LocationItem) => {
      setQuery(item.label);
      setIsOpen(false);
      setActiveIndex(-1);
      onSelect(item);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' && query.trim()) {
          // Enter on empty results — submit as-is
          onSelect({ label: query.trim(), city: query.trim(), type: 'city' });
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < results.length) {
            handleSelect(results[activeIndex]);
          } else if (results.length > 0) {
            handleSelect(results[0]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setActiveIndex(-1);
          break;
      }
    },
    [isOpen, activeIndex, results, handleSelect, onSelect, query]
  );

  // Click outside → close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <MapPin
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          'w-full pl-11 pr-4 py-4 bg-white border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg text-base',
          inputClassName
        )}
      />

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((item, i) => (
            <button
              key={`${item.city}-${item.district || ''}`}
              type="button"
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                i === activeIndex
                  ? 'bg-brand-primary/5 text-brand-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {item.type === 'city' ? (
                <MapPin size={16} className="shrink-0 text-brand-primary" />
              ) : (
                <Building2 size={16} className="shrink-0 text-gray-400" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{item.label}</span>
                {item.type === 'district' && (
                  <span className="text-xs text-gray-400 ml-1">ilçe</span>
                )}
              </div>
              {item.type === 'city' && (
                <Search size={14} className="shrink-0 text-gray-300" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
