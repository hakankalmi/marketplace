'use client';

import { useState, useRef } from 'react';
import { Camera, X, Loader2, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { uploadOrderPhoto } from '@/lib/upload';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (urls: string[]) => void;
  type: 'before' | 'after';
  orderId?: string;
  maxPhotos?: number;
  label?: string;
  hint?: string;
}

export function PhotoUploader({
  photos,
  onChange,
  type,
  orderId,
  maxPhotos = 5,
  label,
  hint,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) return;

    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError('');

    try {
      const urls: string[] = [];
      for (const file of selected) {
        const url = await uploadOrderPhoto(file, type, orderId);
        urls.push(url);
      }
      onChange([...photos, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme başarısız.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-brand-text mb-2">{label}</p>
      )}
      {hint && (
        <p className="text-xs text-brand-text-muted mb-3">{hint}</p>
      )}

      {/* Photo grid */}
      <div className="flex flex-wrap gap-2">
        {photos.map((url, i) => (
          <div
            key={url}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-brand-border group"
          >
            <Image
              src={url}
              alt={`${type} ${i + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
            <button
              onClick={() => handleRemove(i)}
              aria-label="Fotoğrafı kaldır"
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} className="text-white" />
            </button>
            {/* Before/After label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-1.5 py-0.5">
              <span className="text-[9px] font-medium text-white uppercase tracking-wider">
                {type === 'before' ? 'Önce' : 'Sonra'}
              </span>
            </div>
          </div>
        ))}

        {/* Upload button */}
        {photos.length < maxPhotos && (
          <label
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-brand-border hover:border-brand-primary/40 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 size={20} className="text-brand-primary animate-spin" />
            ) : (
              <>
                <Camera size={20} className="text-brand-text-muted mb-1" />
                <span className="text-[10px] text-brand-text-muted">
                  {photos.length === 0 ? 'Ekle' : `${photos.length}/${maxPhotos}`}
                </span>
              </>
            )}
          </label>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-brand-error mt-2">{error}</p>
      )}

      {/* Upload status */}
      {uploading && (
        <p className="text-xs text-brand-text-muted mt-2 flex items-center gap-1">
          <Loader2 size={12} className="animate-spin" />
          Yükleniyor...
        </p>
      )}
    </div>
  );
}
