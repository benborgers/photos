import { useState } from "react";
import { usePage } from "@inertiajs/react";
import Month from "./month";
import { monthRange } from "@/lib/month-range";
import type { Photo } from "@/lib/types";
import Lightbox from "./lightbox";
import Caption from "./caption";

export default function Calendar() {
  const props = usePage().props;
  const photos = props.photos as Photo[];

  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null);

  const months = monthRange(photos).reverse();

  return (
    <>
      <div className="space-y-6">
        {months.map(([year, month]) => (
          <Month
            key={`${year}-${month}`}
            year={year}
            month={month}
            onPhotoClick={setLightboxPhoto}
            onPhotoHoverChange={setHoveredPhoto}
          />
        ))}
      </div>

      <Lightbox
        photo={lightboxPhoto}
        setPhoto={setLightboxPhoto}
        nextPhoto={(() => {
          const index = photos.findIndex(
            (photo) => photo.date === lightboxPhoto?.date
          );
          if (index !== -1 && photos[index + 1]) {
            return photos[index + 1];
          }
          return null;
        })()}
        previousPhoto={(() => {
          const index = photos.findIndex(
            (photo) => photo.date === lightboxPhoto?.date
          );
          if (index !== -1 && photos[index - 1]) {
            return photos[index - 1];
          }
          return null;
        })()}
      />

      <Caption photo={hoveredPhoto} />
    </>
  );
}
