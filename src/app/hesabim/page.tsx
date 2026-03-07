'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { getProfile, updateProfile } from '@/lib/api/customer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProfilPage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setCity(profile.city || '');
    setInitialized(true);
  }

  const mutation = useMutation({
    mutationFn: () => updateProfile({ name, email, city }),
    onSuccess: () => {
      toast.success('Profil güncellendi');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => toast.error('Profil güncellenemedi'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-brand-text mb-6">
        Profil Bilgileri
      </h1>

      <div className="max-w-lg space-y-4">
        <Input
          label="Ad Soyad"
          icon={<User size={18} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Telefon"
          icon={<Phone size={18} />}
          value={profile?.phone || ''}
          disabled
        />

        <Input
          label="E-posta"
          icon={<Mail size={18} />}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Şehir"
          icon={<MapPin size={18} />}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          className="mt-2"
        >
          Kaydet
        </Button>
      </div>
    </div>
  );
}
