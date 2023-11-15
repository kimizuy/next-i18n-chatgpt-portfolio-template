import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Link } from "@/components/link";
import IconPic from "../icon.png";
import Image from "next/image";
import { Locale } from "@/utils/types";
import { getDictionary } from "@/utils/get-dictionary";
import { Navigation } from "@/components/navigation";
import { i18nConfig } from "@/utils/i18n-config";

const SITE_TITLE = "sloth.dev";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: { lang: Locale };
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: Props) {
  const dictionaly = getDictionary(params.lang);

  return {
    title: {
      template: `%s | ${SITE_TITLE}`,
      default: SITE_TITLE,
    },
    description: dictionaly.siteDescription,
  };
}

export type PageProps = Omit<Props, "children">;

export default function RootLayout({ children, params }: Props) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <div className="grid min-h-screen grid-cols-[100%] grid-rows-[auto,1fr,auto]">
          <header className="sticky top-0 z-10 grid h-16 place-items-center border-b bg-background px-4 md:px-8">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-1 text-lg font-bold"
              >
                <span className="relative h-[1.8em] w-[1.8em]">
                  <Image
                    src={IconPic}
                    alt=""
                    sizes="36px"
                    fill
                    priority
                    className="object-contain"
                  />
                </span>
                {SITE_TITLE}
              </Link>
              <Navigation />
            </div>
          </header>
          <main className="p-[2rem_1rem_8rem] md:p-[3rem_2rem_12rem]">
            <div className="mx-auto max-w-3xl">{children}</div>
          </main>
          <footer className="grid h-16 place-items-center border-t px-4 md:px-8">
            <div className="mx-auto grid w-full max-w-5xl items-center">
              <div className="place-self-center">© 2023 Kimizu Yamasaki</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
