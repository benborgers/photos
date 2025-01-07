export function getPhotoFiles(): Record<string, any> {
  return import.meta.glob("/src/photos/*.{jpg,mov}");
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
