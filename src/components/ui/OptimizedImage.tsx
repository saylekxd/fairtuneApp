import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}) => {
  // Function to generate optimized Unsplash URL
  const getOptimizedUrl = (url: string) => {
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0];
      const params = new URLSearchParams({
        auto: 'format',
        fit: 'crop',
        q: '75', // Quality
      });

      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());

      return `${baseUrl}?${params.toString()}`;
    }
    return url;
  };

  return (
    <img
      src={getOptimizedUrl(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      width={width}
      height={height}
      {...props}
    />
  );
};