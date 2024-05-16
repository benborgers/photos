import { useEffect, useRef, useState } from "react";
import { Photo } from "@/lib/types";
import { twMerge } from "tailwind-merge";

export default function Caption({ photo }: { photo: Photo | null }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const pageY = e.pageY;
      const pageX = e.pageX;

      const width = window.innerWidth;

      if (container.current) {
        container.current.style.top = `${pageY + 2}px`;

        // max-w-64 = 16rem
        if (width - pageX > 16 * 16) {
          container.current.style.left = `${pageX + 2}px`;
          container.current.style.right = "auto";
        } else {
          container.current.style.right = `${width - pageX}px`;
          container.current.style.left = "auto";
        }
      }
    };

    document.addEventListener("mousemove", listener);

    return () => {
      document.removeEventListener("mousemove", listener);
    };
  }, []);

  return (
    <div
      className={twMerge(
        "absolute bg-gray-800/95 border border-gray-600 shadow-lg text-white px-1.5 py-0.5 rounded-md",
        !photo?.caption && "hidden"
      )}
      ref={container}
    >
      <p className="text-sm font-semibold max-w-64">{photo?.caption}</p>
    </div>
  );
}
