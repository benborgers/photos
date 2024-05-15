import { useState } from "react";
import Month from "./month";
import { monthRange } from "../lib/month-range";
import type { Photo } from "../lib/types";
import Lightbox from "./lightbox";

export default function Calendar({ photos }: { photos: Photo[] }) {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const months = monthRange(photos).reverse();

  return (
    <>
      <div className="space-y-6">
        {months.map(([year, month]) => (
          <Month
            key={`${year}-${month}`}
            year={year}
            month={month}
            photos={photos}
            onPhotoClick={setLightboxPhoto}
          />
        ))}
      </div>

      <Lightbox photo={lightboxPhoto} setPhoto={setLightboxPhoto} />
    </>
  );
}
