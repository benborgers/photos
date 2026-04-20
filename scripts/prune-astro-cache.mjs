import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const astroAssetsDir = path.join(process.cwd(), "node_modules", ".astro", "assets");
const cacheBudgetMb = Number(process.env.ASTRO_CACHE_BUDGET_MB ?? 900);
const cacheBudgetBytes = cacheBudgetMb * 1024 * 1024;

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function main() {
  let names;
  try {
    names = await readdir(astroAssetsDir);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      console.log("No Astro asset cache found, skipping prune.");
      return;
    }

    throw error;
  }

  const files = await Promise.all(
    names.map(async (name) => {
      const filePath = path.join(astroAssetsDir, name);
      const fileStat = await stat(filePath);
      return {
        filePath,
        size: fileStat.size,
      };
    })
  );

  let totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (totalBytes <= cacheBudgetBytes) {
    console.log(
      `Astro asset cache is ${formatMb(totalBytes)}, within ${cacheBudgetMb} MB budget.`
    );
    return;
  }

  files.sort((a, b) => b.size - a.size);

  let deletedFiles = 0;
  let deletedBytes = 0;

  for (const file of files) {
    if (totalBytes <= cacheBudgetBytes) {
      break;
    }

    await rm(file.filePath);
    totalBytes -= file.size;
    deletedBytes += file.size;
    deletedFiles += 1;
  }

  console.log(
    [
      `Pruned Astro asset cache to ${formatMb(totalBytes)}.`,
      `Deleted ${deletedFiles} files totaling ${formatMb(deletedBytes)}.`,
      `Budget: ${cacheBudgetMb} MB.`,
    ].join(" ")
  );
}

await main();
