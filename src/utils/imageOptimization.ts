/**
 * Image optimization utilities
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png";
}

/**
 * Generate optimized image URL with responsive sizes
 */
export const getOptimizedImageUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  const { width, height, quality = 80, format = "webp" } = options;

  // If using a CDN or image optimization service, add parameters
  // For now, return original src (can be extended with Cloudinary, Imgix, etc.)
  if (src.startsWith("http") && (width || height || quality !== 80)) {
    // Example for Cloudinary: return `${src}?w=${width}&h=${height}&q=${quality}&f=${format}`;
    // Example for Imgix: return `${src}?w=${width}&h=${height}&q=${quality}&fm=${format}`;
  }

  return src;
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (
  baseSrc: string,
  sizes: number[],
  options: Omit<ImageOptimizationOptions, "width"> = {}
): string => {
  return sizes
    .map((size) => {
      const url = getOptimizedImageUrl(baseSrc, { ...options, width: size });
      return `${url} ${size}w`;
    })
    .join(", ");
};

/**
 * Lazy load image with intersection observer
 */
export const lazyLoadImage = (img: HTMLImageElement, src: string, placeholder?: string): void => {
  if ("loading" in HTMLImageElement.prototype) {
    // Native lazy loading supported
    img.loading = "lazy";
    img.src = src;
    if (placeholder) {
      img.src = placeholder;
      img.onload = () => {
        img.src = src;
      };
    }
  } else {
    // Fallback to Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            target.src = src;
            observer.unobserve(target);
          }
        });
      },
      { rootMargin: "50px" }
    );

    if (placeholder) {
      img.src = placeholder;
    }
    observer.observe(img);
  }
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    document.head.appendChild(link);
  });
};
