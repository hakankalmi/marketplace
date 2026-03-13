import { API_URL, BRAND_CODE } from './constants';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 1200;

/** Resize image client-side before upload */
function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
        resolve(file);
        return;
      }

      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
}

/** Upload a photo through authenticated backend proxy and return the download URL */
export async function uploadOrderPhoto(
  file: File,
  type: 'before' | 'after',
  orderId?: string
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Sadece resim dosyaları yüklenebilir.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Dosya boyutu 5MB\'dan küçük olmalı.');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('mp_token') : null;
  if (!token) throw new Error('Not authenticated');

  const resized = await resizeImage(file);
  const folder = orderId ? `orders/${orderId}/${type}` : `orders/temp/${type}`;

  const formData = new FormData();
  formData.append('file', resized, `${Date.now()}.jpg`);
  formData.append('folder', folder);

  const res = await fetch(`${API_URL}/api/mp/me/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Marketplace-Brand': BRAND_CODE,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Upload failed');
  }

  const data = await res.json();
  return data.url;
}
