import { Suspense } from 'react';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyListView } from './company-list-view';
import { ListSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Firmalar — En İyi Hizmet Firmaları',
  description: 'Şehrinizde en güvenilir firmaları keşfedin, karşılaştırın ve sipariş verin.',
};

export default function FirmalarPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-heading font-bold text-brand-text mb-2">
            Firmalar
          </h1>
          <p className="text-brand-text-muted mb-8">
            Size en uygun firmayı bulun
          </p>
          <Suspense fallback={<ListSkeleton count={9} />}>
            <CompanyListView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
