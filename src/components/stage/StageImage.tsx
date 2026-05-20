"use client";

import Image from "next/image";

interface StageImageProps {
  src: string;
  alt: string;
}

export function StageImage({ src, alt }: StageImageProps) {
  return (
    <div className="relative w-full h-64 mb-8 overflow-hidden rounded-lg md:h-96">
      <Image
        src={src}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
        alt={alt}
        priority
      />
    </div>
  );
}
