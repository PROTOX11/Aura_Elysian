// Global image cache service to prevent reloading images
class ImageCacheService {
  private cache = new Map<string, { image: HTMLImageElement; loaded: boolean; error: boolean }>();
  private preloadPromises = new Map<string, Promise<void>>();

  // Preload an image and cache it
  preloadImage(src: string): Promise<void> {
    // If already cached and loaded, return resolved promise
    if (this.cache.has(src)) {
      const cached = this.cache.get(src)!;
      if (cached.loaded) {
        return Promise.resolve();
      }
      if (cached.error) {
        return Promise.reject(new Error(`Image failed to load: ${src}`));
      }
    }

    // If already preloading, return existing promise
    if (this.preloadPromises.has(src)) {
      return this.preloadPromises.get(src)!;
    }

    // Start new preload
    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, { image: img, loaded: true, error: false });
        this.preloadPromises.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        this.cache.set(src, { image: img, loaded: false, error: true });
        this.preloadPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });

    this.preloadPromises.set(src, promise);
    return promise;
  }

  // Check if image is already loaded
  isImageLoaded(src: string): boolean {
    const cached = this.cache.get(src);
    return cached ? cached.loaded : false;
  }

  // Check if image failed to load
  isImageError(src: string): boolean {
    const cached = this.cache.get(src);
    return cached ? cached.error : false;
  }

  // Get cached image element
  getCachedImage(src: string): HTMLImageElement | null {
    const cached = this.cache.get(src);
    return cached && cached.loaded ? cached.image : null;
  }

  // Preload multiple images
  async preloadImages(srcs: string[]): Promise<void[]> {
    const promises = srcs.map(src => 
      this.preloadImage(src).catch(error => {
        console.warn('Failed to preload image:', error);
        return Promise.resolve(); // Don't fail the entire batch
      })
    );
    
    return Promise.all(promises);
  }

  // Clear cache (useful for memory management)
  clearCache(): void {
    this.cache.clear();
    this.preloadPromises.clear();
  }

  // Get cache size for debugging
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const imageCacheService = new ImageCacheService();
