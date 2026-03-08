import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

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

/** Upload a photo to Firebase Storage and return the download URL */
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

  const resized = await resizeImage(file);
  const timestamp = Date.now();
  const folder = orderId || 'temp';
  const path = `marketplace/orders/${folder}/${type}/${timestamp}.jpg`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, resized, {
    contentType: 'image/jpeg',
  });

  return getDownloadURL(storageRef);
}
