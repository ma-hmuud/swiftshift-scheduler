"use client";

import Image from "next/image";

/**
 * Animated WebP loops (Giphy) — swap ids or use local assets in `/public/landing`.
 */
const GIFS = [
  {
    id: "xTiTnqUxyWbsAXq7Ju",
    caption: "Flow & rhythm",
  },
  {
    id: "l0HlBO7eyXzSZkJri",
    caption: "Team energy",
  },
  {
    id: "l3q2K5jinAlChoCLS",
    caption: "Focused blocks",
  },
] as const;

export function LandingGifGrid() {
  return (
    <div className="landing-gif-grid">
      {GIFS.map((item) => (
        <figure key={item.id} className="landing-gif-card">
          <div className="landing-gif-frame">
            <Image
              src={`https://i.giphy.com/media/${item.id}/giphy.webp`}
              alt=""
              fill
              className="landing-gif-img"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          </div>
          <figcaption className="landing-gif-caption">{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
