import { existsSync } from "fs";
import { bundleMDX as bundleMDXPrimitive } from "mdx-bundler";
import path from "path";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import remarkMdxImages from "remark-mdx-images";

export async function bundleMDX(options: {
  source: string;
  cwd?: string;
  imagesUrl?: string;
}) {
  const { source, cwd, imagesUrl } = options;

  return await bundleMDXPrimitive({
    source,
    cwd,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkMdxImages, // ref: https://www.timjfoster.com/posts/mdx-bundler-with-images
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeCodeTitles,
        rehypePrism,
      ];

      return options;
    },

    esbuildOptions: (options) => {
      if (!imagesUrl) return options;

      options.outdir = path.join(process.cwd(), "public", imagesUrl);
      options.loader = {
        ...options.loader,
        ".avif": "file",
        ".webp": "file",
        ".png": "file",
        ".jpg": "file",
        ".jpeg": "file",
        ".gif": "file",
      };
      options.publicPath = `/${imagesUrl}`;
      options.write = true;

      return options;
    },
  });
}

export function getFilePath(targetFolderPath: string): string {
  const mdFilePath = path.join(targetFolderPath, "index.md");
  const mdxFilePath = path.join(targetFolderPath, "index.mdx");

  if (existsSync(mdFilePath)) {
    return mdFilePath;
  } else if (existsSync(mdxFilePath)) {
    return mdxFilePath;
  } else {
    throw new Error(
      `Neither index.md nor index.mdx file found for page: ${targetFolderPath}`
    );
  }
}
