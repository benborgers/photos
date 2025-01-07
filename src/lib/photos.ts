export function getPhotoFiles(): Record<string, any> {
  return import.meta.glob("/src/photos/*.{jpg,mov}");
}

export function getPhotos(): {
  filename: string;
  ymd: string;
}[] {
  return Object.entries(getPhotoFiles())
    .map(([path, value]) => {
      return {
        filename: path,
        ymd: path.split("/").reverse()[0].split(".")[0],
      };
    })
    .sort((a, b) => {
      return new Date(a.ymd).getTime() - new Date(b.ymd).getTime();
    });
}
