import { getImage } from "astro:assets";

export function getPhotoFiles(): Record<string, any> {
  return import.meta.glob("/src/photos/*.{jpg,png,webp,mov}");
}

export async function getPhotoPageImage(filename: string) {
  const { default: src } = await getPhotoFiles()[filename]();

  // Clamp the SHORTER side to 1200 (instead of always the width) so that
  // wide / panoramic photos keep their resolution instead of being shrunk
  // down by a fixed width. Portrait photos are unaffected (width is their
  // shorter side). Math.min guards against upscaling small sources.
  const target = Math.min(1200, src.width, src.height);
  const dimension =
    src.width >= src.height ? { height: target } : { width: target };

  return getImage({
    src,
    format: "jpg",
    ...dimension,
    alt: "",
    loading: "eager",
  });
}

export function getPhotos(): {
  filename: string;
  ymd: string;
  extension: string;
}[] {
  return Object.entries(getPhotoFiles())
    .map(([path]) => {
      const extension = path.split(".")[1].toLowerCase();
      return {
        filename: path,
        ymd: path.split("/").reverse()[0].split(".")[0],
        extension,
      };
    })
    .sort((a, b) => {
      return new Date(a.ymd).getTime() - new Date(b.ymd).getTime();
    });
}
