import fs from "fs";
import path from "path";
import { Link } from "@/components/link";
import { format } from "date-fns";
import { Metadata } from "next";
import { PageProps } from "../layout";
import { Locale } from "@/utils/types";
import { getPost } from "@/utils/get-post";
import { translateWithDeepL } from "@/utils/translate-with-deepl";

export const metadata: Metadata = {
  title: "Blog",
};

type Props = PageProps;

export default async function Page({ params: { lang } }: Props) {
  const postMatters = await getAllPostMatters(lang);

  return (
    <div>
      <ul>
        {postMatters.map((matter) => (
          <li key={matter.slug} className="flex gap-1">
            <time dateTime={matter.publishedAt.toISOString()}>
              {format(matter.publishedAt, "yyyy-MM-dd")}
            </time>
            <Link href={`/blog/${matter.slug}`}>{matter.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const getAllPostMatters = async (lang: Locale) => {
  const postFilePaths = fs.readdirSync(path.join(process.cwd(), "_posts"));
  const posts = await Promise.all(
    postFilePaths.map(async (slug) => {
      const { frontmatter } = await getPost(slug);
      const translatedTitle = await translateWithDeepL(frontmatter.title, lang);
      return {
        title: translatedTitle,
        publishedAt: frontmatter.publishedAt,
        slug,
      };
    })
  );
  const sortedDescByDate = posts.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );

  return sortedDescByDate;
};
