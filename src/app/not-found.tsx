import Link from 'next/link';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl font-heading font-bold text-brand-primary mb-4">
            404
          </p>
          <h1 className="text-2xl font-heading font-bold text-brand-text mb-2">
            Sayfa Bulunamadı
          </h1>
          <p className="text-brand-text-muted mb-8">
            Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link href="/">
            <Button>Anasayfaya Dön</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
