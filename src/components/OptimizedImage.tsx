import React from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
  sizes?: string;
  srcSet?: string;
  fetchPriority?: "high" | "low" | "auto";
};

// Renders a <picture> with AVIF/WebP where safely supported (Unsplash),
// otherwise falls back to a plain <img>. Never breaks image display.
export default function OptimizedImage({ src, alt, className, width, height, loading = "lazy", decoding = "async", sizes, srcSet, fetchPriority = "auto" }: Props) {
  const isUnsplash = /images\.unsplash\.com/.test(src);

  if (isUnsplash) {
    const url = new URL(src);
    // Ensure width param remains if provided; set fit/crop implicitly
    const baseParams = url.search ? `${url.search}&` : "?";
    const avifSrc = `${url.origin}${url.pathname}${baseParams}fm=avif`;
    const webpSrc = `${url.origin}${url.pathname}${baseParams}fm=webp`;
    return (
      <picture>
        <source srcSet={avifSrc} type="image/avif" />
        <source srcSet={webpSrc} type="image/webp" />
        <img src={src} alt={alt} className={className} width={width as any} height={height as any} loading={loading} decoding={decoding} sizes={sizes} srcSet={srcSet} fetchPriority={fetchPriority as any} />
      </picture>
    );
  }

  return <img src={src} alt={alt} className={className} width={width as any} height={height as any} loading={loading} decoding={decoding} sizes={sizes} srcSet={srcSet} fetchPriority={fetchPriority as any} />;
}


