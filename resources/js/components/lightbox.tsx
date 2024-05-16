import { useEffect } from "react";
import { Description, Dialog, DialogPanel } from "@headlessui/react";
import type { Photo } from "../lib/types";

export default function Lightbox({
  photo,
  setPhoto,
  onNext,
  onPrevious,
}: {
  photo: Photo | null;
  setPhoto: React.Dispatch<React.SetStateAction<Photo | null>>;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const onClose = () => setPhoto(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!photo) {
        return;
      }

      if (e.key === "ArrowRight") {
        onNext();
      }

      if (e.key === "ArrowLeft") {
        onPrevious();
      }
    };

    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, [photo]);

  return (
    <Dialog open={photo !== null} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

      <div className="fixed inset-0">
        <DialogPanel className="h-screen w-screen grid grid-rows-[max-content,1fr]">
          {photo && (
            <Description className="p-4 pb-0 pr-14 text-white/90 text-sm font-semibold">
              <span className="tabular-nums">
                {new Date(photo.date).toLocaleString("en-US", {
                  timeZone: "UTC",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {photo.caption && ` — ${photo.caption}`}
            </Description>
          )}
          <img
            src={photo?.url}
            alt=""
            className="overflow-clip h-full w-full min-w-0 min-h-0 object-contain p-4"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 bg-white/10 rounded-full h-8 w-8 text-xl font-medium"
          >
            ✗
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
