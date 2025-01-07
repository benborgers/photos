export async function getCaption(ymd: string): Promise<string | undefined> {
  const captions = import.meta.glob("/src/photos/*.txt", {
    as: "raw",
  });

  const path = `/src/photos/${ymd}.txt`;

  if (!captions[path]) {
    return undefined;
  }

  return await captions[path]();
}
