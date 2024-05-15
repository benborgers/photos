import { promises as fs } from "fs";
import { parse as parseYaml } from "yaml";

const API_ORIGIN = import.meta.env.DEV
  ? "http://photos.test"
  : "https://api.photos.ben.page";

export type Photo = {
  date: string;
  caption: string;
  url: string;
};

export const loadPhotos = async (origin: string): Promise<Photo[]> => {
  const photos: Photo[] = [];

  for (const folder of await fs.readdir("legacy")) {
    const contents = await fs.readFile(`legacy/${folder}/index.yaml`, "utf-8");
    const data = parseYaml(contents);
    photos.push({
      date: data.date,
      caption: "caption" in data ? data.caption.trim() : null,
      url: origin + data.photo,
    });
  }

  // Disable API loading in dev because it's a bit slow.
  if (!import.meta.env.DEV) {
    const res = await fetch(`${API_ORIGIN}/api/photos`);
    const json = await res.json();
    photos.push(...json.photos);
  }

  return photos.sort((a, b) => (a.date > b.date ? 1 : -1));
};

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
