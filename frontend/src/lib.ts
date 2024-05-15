import { promises as fs } from "fs";
import { parse as parseYaml } from "yaml";

const API_ORIGIN = import.meta.env.DEV
  ? "http://photos.test"
  : "https://api.photos.ben.page";

type Photo = {
  date: string;
  caption: string;
  url: string;
};

export const loadPhotos = async (): Promise<Photo[]> => {
  const photos: Photo[] = [];

  for (const folder of await fs.readdir("legacy")) {
    const contents = await fs.readFile(`legacy/${folder}/index.yaml`, "utf-8");
    const data = parseYaml(contents);
    photos.push({
      date: data.date,
      caption: "caption" in data ? data.caption.trim() : null,
      url: data.photo,
    });
  }

  const res = await fetch(`${API_ORIGIN}/api/photos`);
  const json = await res.json();
  photos.push(...json.photos);

  return photos;
};
