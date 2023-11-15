"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { i18nConfig } from "@/utils/i18n-config";
import { isLocale } from "@/utils/type-predicates";

type Props = ComponentProps<typeof NextLink>;

export function Link({ href, ...props }: Props) {
  const currentPathname = usePathname();
  const currentLocale = getLocaleFromPath(currentPathname);
  const isDefaultLocale = currentLocale === i18nConfig.defaultLocale;
  const newHref = isDefaultLocale ? href : `/${currentLocale}${href}`;

  return <NextLink {...props} href={newHref} />;
}

function getLocaleFromPath(path: string) {
  const [firstSegment] = path.split("/").filter(Boolean);
  return isLocale(firstSegment) ? firstSegment : i18nConfig.defaultLocale;
}
