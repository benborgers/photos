import type { Photo } from "./types";

export const monthRange = (photos: Photo[]): [number, number][] => {
  const set = new Set<string>();

  for (const photo of photos) {
    const [year, month] = photo.date.split("-").map(Number);
    set.add(`${year}-${month}`);
  }

  return Array.from(set).map(
    (month) => month.split("-").map(Number) as [number, number]
  );
};
