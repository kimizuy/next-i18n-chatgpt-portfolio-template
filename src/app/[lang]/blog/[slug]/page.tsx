import fs from "fs";
import path from "path";
import { format } from "date-fns";
import { MDXComponent } from "@/components/mdx-component";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/components/link";
import { PageProps } from "../../layout";
import { getDictionary } from "@/utils/get-dictionary";
import { getPost } from "@/utils/get-post";
import { translateWithDeepL } from "@/utils/translate-with-deepl";
import "@/styles/prism-vsc-dark-plus.css";

type Props = { params: { slug: string } } & PageProps;

export function generateStaticParams() {
  const postFilePaths = fs.readdirSync(path.join(process.cwd(), "_posts"));
  return postFilePaths.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug);
  const title = await translateWithDeepL(post.frontmatter.title, params.lang);

  return {
    title,
  };
}

export default async function Page({ params: { slug, lang } }: Props) {
  const { code, frontmatter } = await getPost(slug);
  const dictionary = getDictionary(lang);
  const title = await translateWithDeepL(frontmatter.title, lang);

  return (
    <div className="grid gap-16">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">{title}</h1>
        <div className="mt-4 text-sm">
          <time dateTime={frontmatter.publishedAt.toISOString()}>
            {format(frontmatter.publishedAt, "yyyy-MM-dd")}
          </time>
        </div>
      </header>
      <main>
        <MDXComponent code={code} lang={lang} />
      </main>
      <footer>
        <Link href="/blog" className="flex gap-1">
          <ChevronLeft />
          {dictionary.backToBlogTop}
        </Link>
      </footer>
    </div>
  );
}
