import { useState, useCallback } from 'react';

interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

interface UseCloudinaryUploadReturn {
  uploadImage: (file: File, folder?: string) => Promise<UploadResult>;
  uploadMultipleImages: (files: File[], folder?: string) => Promise<UploadResult[]>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File, folder: string = 'aura-elysian'): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload/single', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadProgress(100);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadMultipleImages = useCallback(async (files: File[], folder: string = 'aura-elysian'): Promise<UploadResult[]> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });
      formData.append('folder', folder);

      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const results = await response.json();
      setUploadProgress(100);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
    uploadProgress,
    error,
  };
};
