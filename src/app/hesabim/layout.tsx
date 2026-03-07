import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AccountSidebar } from './account-sidebar';

export const metadata = {
  title: 'Hesabım',
};

export default function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <AuthGuard>
        <main className="min-h-screen bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-[240px_1fr] gap-8">
              <AccountSidebar />
              <div>{children}</div>
            </div>
          </div>
        </main>
      </AuthGuard>
      <Footer />
    </>
  );
}
