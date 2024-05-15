import { useState } from "react";
import { Description, Dialog, DialogPanel } from "@headlessui/react";
import type { Photo } from "../lib/types";

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
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="p-4">
          {photo?.caption && <Description>{photo?.caption}</Description>}
          <img
            src={photo?.url}
            alt=""
            className="max-h-full max-w-full object-cover"
          />
          <button onClick={onClose}>&cross;</button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
