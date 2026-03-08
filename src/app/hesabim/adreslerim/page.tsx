'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Trash2, Star, X } from 'lucide-react';
import {
  getAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/lib/api/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function AdreslerimPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      createAddress({ label: title, fullAddress, city, district }),
    onSuccess: () => {
      toast.success('Adres eklendi');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
    },
    onError: () => toast.error('Adres eklenemedi'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      toast.success('Adres silindi');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: () => toast.error('Adres silinemedi'),
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      toast.success('Varsayılan adres güncellendi');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setTitle('');
    setFullAddress('');
    setCity('');
    setDistrict('');
  };

  const hasAddresses = addresses && addresses.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-brand-text">
          Adreslerim
        </h1>
        {/* Adres varsa üstte de buton göster */}
        {hasAddresses && (
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            <span className="hidden sm:inline">{showForm ? 'İptal' : 'Yeni Adres'}</span>
          </Button>
        )}
      </div>

      {/* Yeni Adres Formu */}
      {showForm && (
        <div className="mb-6 p-4 sm:p-5 bg-brand-surface rounded-brand border border-brand-border space-y-4">
          <Input
            label="Adres Başlığı"
            placeholder="Ev, İş, vb."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Şehir"
              placeholder="İstanbul"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="İlçe"
              placeholder="Kadıköy"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">
              Açık Adres
            </label>
            <textarea
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="Mahalle, sokak, bina no, daire no..."
              rows={3}
              className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => addMutation.mutate()}
              loading={addMutation.isPending}
              disabled={!title || !fullAddress || !city}
              className="flex-1 sm:flex-none"
            >
              Kaydet
            </Button>
            <Button
              variant="secondary"
              onClick={resetForm}
              className="flex-1 sm:flex-none"
            >
              İptal
            </Button>
          </div>
        </div>
      )}

      {/* Adres Listesi */}
      {hasAddresses ? (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 bg-brand-surface rounded-brand border border-brand-border"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <MapPin
                    size={18}
                    className="text-brand-primary mt-0.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-brand-text">{addr.label}</p>
                      {addr.isDefault && (
                        <Badge variant="accent">Varsayılan</Badge>
                      )}
                    </div>
                    <p className="text-sm text-brand-text-muted mt-1 break-words">
                      {addr.fullAddress}
                    </p>
                    <p className="text-xs text-brand-text-muted mt-0.5">
                      {[addr.district, addr.city].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => defaultMutation.mutate(addr.id)}
                      className="p-2 text-brand-text-muted hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-primary/5"
                      title="Varsayılan yap"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Bu adresi silmek istediğinize emin misiniz?')) {
                        deleteMutation.mutate(addr.id);
                      }
                    }}
                    className="p-2 text-brand-text-muted hover:text-brand-error transition-colors rounded-lg hover:bg-brand-error/5"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-brand-primary" />
          </div>
          <h3 className="text-lg font-medium text-brand-text">
            Henüz adres eklenmemiş
          </h3>
          <p className="text-brand-text-muted mt-1 mb-6">
            İlk adresinizi ekleyin, siparişlerde kullanın.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Yeni Adres Ekle
          </Button>
        </div>
      ) : null}
    </div>
  );
}
