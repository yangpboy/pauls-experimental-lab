import { useEffect, useRef, useState } from 'react';

type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function LazyImage({ src, alt, className, priority = false }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center ${className} ${!isLoaded ? 'min-h-[300px] md:min-h-[500px]' : ''}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-8 h-8 border-4 border-neutral-300 dark:border-neutral-700 border-t-light-teal rounded-full animate-spin" />
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto transition-all duration-700 ease-out relative z-10 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          onLoad={() => setIsLoaded(true)}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
