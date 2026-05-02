import path from "node:path";
import { fileURLToPath } from "node:url";

const libDir = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(libDir, "../..");

export const sitePaths = {
  repoRoot,
  pages: path.join(repoRoot, "pages"),
  images: path.join(repoRoot, "images"),
  feed: path.join(repoRoot, "feed.xml"),
  index: path.join(repoRoot, "index.html"),
  year: (year: number) => path.join(repoRoot, `${year}.html`),
  monthArchive: (month: string) => path.join(repoRoot, `${month}.html`)
};
