import { useState } from "react";
import { Description, Dialog, DialogPanel } from "@headlessui/react";
import type { Photo } from "../lib";

export default function Lightbox({
  photo,
  setPhoto,
}: {
  photo: Photo;
  setPhoto: React.Dispatch<React.SetStateAction<Photo | null>>;
}) {
  const onClose = () => setPhoto(null);

  return (
    <Dialog open={photo !== null} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel>
          {photo?.caption && <Description>{photo?.caption}</Description>}
          <img src={photo?.url} alt="" />
          <button onClick={onClose}>&cross;</button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
