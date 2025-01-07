import fs from "node:fs";
import { MEDIA_EXTENSIONS } from "./constants";

export default function getPhotos(): {
  filename: string;
  date: string;
}[] {
  return fs
    .readdirSync("./src/photos")
    .filter((filename) => MEDIA_EXTENSIONS.includes(filename.split(".")[1]))
    .sort()
    .map((filename) => ({
      filename,
      date: filename.split(".")[0],
    }));
}
