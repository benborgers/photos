import { promises as fs } from "fs";
import { parse as parseYaml } from "yaml";
import { API_ORIGIN } from "./constants";
import type { Photo } from "./types";

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
