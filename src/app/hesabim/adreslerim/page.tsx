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
      createAddress({ title, fullAddress, city, district }),
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
        <h1 className="text-2xl font-heading font-bold text-brand-text">
          Adreslerim
        </h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'İptal' : 'Yeni Adres'}
        </Button>
      </div>

      {/* Yeni Adres Formu */}
      {showForm && (
        <div className="mb-6 p-4 bg-brand-surface rounded-brand border border-brand-border space-y-4">
          <Input
            label="Adres Başlığı"
            placeholder="Ev, İş, vb."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
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
              rows={2}
              className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 resize-none"
            />
          </div>
          <Button
            onClick={() => addMutation.mutate()}
            loading={addMutation.isPending}
            disabled={!title || !fullAddress || !city}
          >
            Ekle
          </Button>
        </div>
      )}

      {/* Adres Listesi */}
      {addresses && addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 bg-brand-surface rounded-brand border border-brand-border flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-brand-text-muted mt-0.5 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-brand-text">{addr.title}</p>
                    {addr.isDefault && (
                      <Badge variant="accent">Varsayılan</Badge>
                    )}
                  </div>
                  <p className="text-sm text-brand-text-muted mt-0.5">
                    {addr.fullAddress}
                  </p>
                  <p className="text-xs text-brand-text-muted">
                    {addr.district}, {addr.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => defaultMutation.mutate(addr.id)}
                    className="p-1.5 text-brand-text-muted hover:text-brand-primary transition-colors"
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
                  className="p-1.5 text-brand-text-muted hover:text-brand-error transition-colors"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-brand-text-muted mb-4" />
          <h3 className="text-lg font-medium text-brand-text">
            Henüz adres eklenmemiş
          </h3>
          <p className="text-brand-text-muted mt-1">
            İlk adresinizi ekleyin, siparişlerde kullanın.
          </p>
        </div>
      )}
    </div>
  );
}
