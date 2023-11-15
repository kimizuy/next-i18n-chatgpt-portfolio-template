import { MDXComponent } from "@/components/mdx-component";
import Image from "next/image";
import { PageProps } from "./layout";
import { getDoc } from "@/utils/get-doc";

type Props = PageProps;

export default async function Page({ params: { lang } }: Props) {
  const { code } = await getDoc("home");

  return (
    <div className="grid gap-8">
      <div className="relative h-0 overflow-hidden pt-[calc(1/2*100%)]">
        <Image
          alt="Profile Image"
          src="/profile.png"
          fill
          className="object-contain"
        />
      </div>
      <MDXComponent code={code} lang={lang} />
    </div>
  );
}
