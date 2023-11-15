import "server-only";
import type { Locale } from "./types";
import { ja } from "@/dictionaries/ja";
import { en } from "@/dictionaries/en";
import { de } from "@/dictionaries/de";

const dictionaries = {
  ja,
  en,
  de,
};

export const getDictionary = (locale: Locale) => dictionaries[locale];
