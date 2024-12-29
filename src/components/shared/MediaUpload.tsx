import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface MediaUploadProps {
  onMediaSelected: (files: { type: 'image' | 'video', url: string }[]) => void;
  currentMedia?: { type: 'image' | 'video', url: string }[];
  maxFiles?: number;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onMediaSelected,
  currentMedia = [],
  maxFiles = 5
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [media, setMedia] = useState(currentMedia);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    if (media.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newMedia = files.map(file => {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      return {
        type,
        url: URL.createObjectURL(file)
      };
    });

    const updatedMedia = [...media, ...newMedia];
    setMedia(updatedMedia);
    onMediaSelected(updatedMedia);
  };

  const removeMedia = (index: number) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
    onMediaSelected(updatedMedia);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600">
          Drag and drop your media files here, or{' '}
          <label className="text-blue-500 cursor-pointer hover:text-blue-600">
            browse
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInput}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Support images and videos (max {maxFiles} files)
        </p>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {media.map((item, index) => (
            <div key={index} className="relative group">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-32 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
