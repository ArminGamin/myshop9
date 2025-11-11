import React, { useMemo, useState, useCallback } from "react";

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

// Renders a <picture> with AVIF/WebP where safely supported.
// - For Unsplash: add fm=avif/webp params
// For local product assets, prefer AVIF/WebP with safe runtime fallback to PNG/JPG.
export default function OptimizedImage({ src, alt, className, width, height, loading = "lazy", decoding = "async", sizes, srcSet, fetchPriority }: Props) {
  const isUnsplash = /images\.unsplash\.com/.test(src);
  const isLocalProduct = /^\/products\/.+\.(png|jpe?g)$/i.test(src);
  const fpAttr = fetchPriority ? { fetchpriority: fetchPriority as any } : {};

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
        <img src={src} alt={alt} className={className} width={width as any} height={height as any} loading={loading} decoding={decoding} sizes={sizes} srcSet={srcSet} {...fpAttr} />
      </picture>
    );
  }

  if (isLocalProduct) {
    const base = src.replace(/\.(png|jpe?g)$/i, "");
    const sourceChain = useMemo(() => [`${base}.avif`, `${base}.webp`, src], [base, src]);
    const [currentSrcIndex, setCurrentSrcIndex] = useState(0);

    const handleError = useCallback(() => {
      setCurrentSrcIndex((i) => (i < sourceChain.length - 1 ? i + 1 : i));
    }, [sourceChain.length]);

    return (
      <img
        src={sourceChain[currentSrcIndex]}
        alt={alt}
        className={className}
        width={width as any}
        height={height as any}
        loading={loading}
        decoding={decoding}
        sizes={sizes}
        srcSet={srcSet}
        {...fpAttr}
        onError={handleError}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width as any}
      height={height as any}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      srcSet={srcSet}
      {...fpAttr}
    />
  );
}


