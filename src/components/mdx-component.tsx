import { getMDXComponent } from "mdx-bundler/client";
import Image from "next/image";
import { Link } from "./link";
import { Locale } from "@/utils/types";
import { createElement } from "react";
import { cn } from "@/utils/helpers";
import { translateWithChatGPT } from "@/utils/translate-with-chatgpt";

type ElementKey = keyof JSX.IntrinsicElements;

interface Props {
  code: string;
  lang: Locale;
  slug?: string;
}

export async function MDXComponent({ code, lang, slug = "" }: Props) {
  const Component = getMDXComponent(code);
  const translateTargetTags: ElementKey[] = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "p",
    "li",
  ];
  const translatedComponents = translateTargetTags.reduce<
    Record<string, React.ComponentType<any>>
  >((acc, tag) => {
    acc[tag] = async ({ children, ...rest }) =>
      createElement(tag, rest, await translateWithChatGPT(children, lang));
    return acc;
  }, {});

  return (
    <div className="prose max-w-full dark:prose-invert">
      <Component
        components={{
          img: ({ alt, src }) => {
            if (!src) return null;
            return (
              <span className="relative block h-0 overflow-hidden pt-[calc(9/16*100%)]">
                <Image
                  alt={alt ?? ""}
                  src={src}
                  fill
                  className="m-0 object-cover"
                />
              </span>
            );
          },
          a: async ({ children, href, id, ...rest }) => {
            if (!href) return null;
            const translated = await translateWithChatGPT(children, lang);
            if (isFullUrl(href)) {
              return (
                <a
                  {...rest}
                  id={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {translated}
                </a>
              );
            } else {
              const isAnchor = href.startsWith("#");
              const newHref = isAnchor ? `/blog/${slug}${href}` : href;
              return (
                <Link id={id} href={newHref}>
                  {translated}
                </Link>
              );
            }
          },
          code: ({ className, ...rest }) => (
            <code {...rest} className={cn(className, "w-0 block")} />
          ),
          ...translatedComponents,
        }}
      />
    </div>
  );
}

function isFullUrl(url: string): boolean {
  try {
    new URL(url);

    return true;
  } catch (error) {
    return false;
  }
}
