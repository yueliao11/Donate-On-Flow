import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  currentImage: string;
  onImageSelected: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageSelected }) => {
  // For demo purposes, using a mock upload function
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, implement actual image upload to a storage service
      const mockUrl = 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7';
      onImageSelected(mockUrl);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Project cover"
            className="w-full h-48 object-cover rounded-md"
          />
          <button
            onClick={() => onImageSelected('')}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
          >
            ×
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Click to upload image</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      )}
    </div>
  );
};