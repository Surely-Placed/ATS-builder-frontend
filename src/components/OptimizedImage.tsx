import { useState, useEffect, useRef } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { lazyLoadImage, getOptimizedImageUrl, ImageOptimizationOptions } from '@/utils/imageOptimization';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  placeholder?: string;
  optimization?: ImageOptimizationOptions;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  placeholder,
  optimization,
  priority = false,
  className,
  alt,
  ...props
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const optimizedSrc = getOptimizedImageUrl(src, optimization);

    if (priority) {
      // Load immediately for priority images
      setImageSrc(optimizedSrc);
    } else {
      // Lazy load for non-priority images
      lazyLoadImage(imgRef.current, optimizedSrc, placeholder);
      setImageSrc(optimizedSrc);
    }
  }, [src, placeholder, priority, optimization]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
        ...props.style,
      }}
      {...props}
    />
  );
};

