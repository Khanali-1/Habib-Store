"use client";

import { useState } from "react";

interface SafeImageProps {
  src?: string;
  alt: string;
  /** Used only when `src` is empty or fails to load */
  fallbackSrc?: string;
  className?: string;
  loading?: "eager" | "lazy";
}

/**
 * Plain <img> that never shows a broken-image icon.
 * Order of preference: real product image -> editorial fallback -> cream block.
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  className = "",
  loading = "lazy",
}: SafeImageProps) {
  const [stage, setStage] = useState<0 | 1 | 2>(src ? 0 : fallbackSrc ? 1 : 2);

  if (stage === 2) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-gradient-to-br from-cream to-sand ${className}`}
      />
    );
  }

  const current = stage === 0 ? src : fallbackSrc;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={() => setStage((s) => (s === 0 && fallbackSrc ? 1 : 2))}
    />
  );
}
