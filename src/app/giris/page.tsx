import { Suspense } from 'react';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { OtpForm } from '@/components/auth/OtpForm';

export const metadata = {
  title: 'Giriş Yap',
  description: 'Telefon numaranızla giriş yapın veya kayıt olun.',
};

export default function GirisPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-16">
        <Suspense>
          <OtpForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
