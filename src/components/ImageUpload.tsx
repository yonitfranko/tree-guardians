'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const MAX_IMAGE_SIZE = 500000; // 500KB
const MAX_TOTAL_IMAGES_SIZE = 1000000; // 1MB
const MAX_IMAGE_DIMENSION = 800; // pixels - reduced from 1200 to 800

// Add size validation function
const validateImageSize = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    if (file.size > MAX_IMAGE_SIZE) {
      alert(`התמונה ${file.name} גדולה מדי. הגודל המקסימלי הוא 500KB`);
      resolve(false);
      return;
    }
    resolve(true);
  });
};

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Utility function to resize an image
  const resizeImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > MAX_IMAGE_DIMENSION) {
          height = (height * MAX_IMAGE_DIMENSION) / width;
          width = MAX_IMAGE_DIMENSION;
        } else if (height > MAX_IMAGE_DIMENSION) {
          width = (width * MAX_IMAGE_DIMENSION) / height;
          height = MAX_IMAGE_DIMENSION;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  };

  const handleFileUpload = async (files: FileList) => {
    const newImages = [...images];
    let totalSize = 0;

    // Calculate current total size
    for (const image of images) {
      if (image.startsWith('data:')) {
        totalSize += image.length * 0.75; // Approximate size from base64
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Validate file size
        const isValid = await validateImageSize(file);
        if (!isValid) continue;

        // Check total size
        if (totalSize + file.size > MAX_TOTAL_IMAGES_SIZE) {
          alert('הגעת לגודל המקסימלי הכולל של התמונות (1MB)');
          break;
        }

        // Convert to data URL
        const reader = new FileReader();
        const imageDataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Update total size
        totalSize += file.size;

        // Add the image
        newImages.push(imageDataUrl);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`שגיאה בעיבוד הקובץ ${file.name}`);
      }
    }

    onChange(newImages);
  };

  const handleAddImageUrl = () => {
    if (imageUrl && imageUrl.trim()) {
      onChange([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">תמונות</label>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          type="button"
          onClick={openCamera}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          צלם תמונה
        </button>

        <button
          type="button"
          onClick={openGallery}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          בחר מהגלריה
        </button>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          ref={cameraInputRef}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />

        <div className="flex-1 flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="או הזן קישור לתמונה"
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            הוסף
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded">
                <Image
                  src={image}
                  alt={`תמונה ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={image.startsWith('data:')}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        * גודל מקסימלי לתמונה: 500KB, סך הכל: 1MB
      </p>
    </div>
  );
} 