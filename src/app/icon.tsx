import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#DC2626',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: -1,
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size },
  );
}
