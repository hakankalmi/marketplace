'use client';

/**
 * Global error boundary — catches errors in root layout.
 * Must include its own <html> and <body> tags.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#fafafa' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px',
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
              Bir sorun oluştu
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
              Sayfa yüklenirken beklenmeyen bir hata oluştu.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
