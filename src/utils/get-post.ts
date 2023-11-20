import path from "path";
import { bundleMDX, getFilePath } from "./mdx-bundler";
import { readFileSync } from "fs";
import { getErrorMessage } from "./helpers";
import { isFrontmatter } from "./type-predicates";
import { cache } from "react";

const POSTS_PATH = path.join(process.cwd(), "_posts");

export const getPost = cache(async (slug: string) => {
  const filePath = getFilePath(path.join(POSTS_PATH, slug));
  const source = readFileSync(filePath, "utf-8");
  const cwd = path.join(POSTS_PATH, slug);
  const imagesUrl = path.join("_posts", slug);
  try {
    const { code, matter } = await bundleMDX({ source, cwd, imagesUrl });
    const frontmatter = matter.data;
    if (!isFrontmatter(frontmatter)) {
      throw new Error(`Invalid format in "${filePath}".`);
    }
    return { code, frontmatter, slug };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`${slug}: ${errorMessage}`);
    process.exit(1);
  }
});

export async function bundlePost(slug: string) {
  try {
    const filePath = getFilePath(path.join(POSTS_PATH, slug));
    const source = readFileSync(filePath, "utf-8");
    const cwd = path.join(POSTS_PATH, slug);
    const imagesUrl = path.join("_posts", slug);
    const result = await bundleMDX({ source, cwd, imagesUrl });
    return result;
  } catch (error) {
    console.error(getErrorMessage(error));
    process.exit(1);
  }
}
