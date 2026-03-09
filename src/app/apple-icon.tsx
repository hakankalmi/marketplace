import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '22%',
          background: '#DC2626',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 110,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: -4,
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size },
  );
}
