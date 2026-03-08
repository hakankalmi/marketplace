import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') || 'Halı Yıkamacılar';
  const subtitle = searchParams.get('subtitle') || 'En iyi firmalar, en uygun fiyatlar';
  const type = searchParams.get('type') || 'home';

  // Type-based accent icon
  const iconMap: Record<string, string> = {
    home: '🏠',
    city: '📍',
    category: '🏷️',
    company: '🏢',
    guide: '📖',
  };
  const icon = iconMap[type] || '✨';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 40%, #F59E0B 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            display: 'flex',
          }}
        />

        {/* Icon */}
        <div
          style={{
            fontSize: 64,
            marginBottom: 24,
            display: 'flex',
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? 48 : 56,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.15,
            maxWidth: '900px',
            display: 'flex',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.85)',
              marginTop: 20,
              maxWidth: '800px',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Brand footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#F59E0B',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              display: 'flex',
            }}
          >
            haliyikamacilar.com
          </div>
        </div>

        {/* Brand name bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 60,
            fontSize: 18,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.6)',
            display: 'flex',
          }}
        >
          Halı Yıkamacılar
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
