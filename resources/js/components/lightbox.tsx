import { useState } from "react";
import { Description, Dialog, DialogPanel } from "@headlessui/react";
import type { Photo } from "../lib/types";
import { twMerge } from "tailwind-merge";

export default function Lightbox({
  photo,
  setPhoto,
}: {
  photo: Photo | null;
  setPhoto: React.Dispatch<React.SetStateAction<Photo | null>>;
}) {
  const onClose = () => setPhoto(null);

  return (
    <Dialog open={photo !== null} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

      <div className="fixed inset-0">
        <DialogPanel
          className={twMerge(
            "h-screen w-screen grid",
            photo?.caption && "grid-rows-[max-content,1fr]"
          )}
        >
          {photo?.caption && (
            <Description className="p-4 pb-0 pr-14 text-white/90 text-sm font-semibold">
              {photo?.caption}
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
