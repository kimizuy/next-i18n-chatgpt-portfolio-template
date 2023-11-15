import "server-only";

import * as deepl from "deepl-node";
import { Locale } from "./types";
import { i18nConfig } from "./i18n-config";
import { cache } from "react";

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

export const translateWithDeepL = cache(
  async (text: any, targetLang: Locale) => {
    if (targetLang === i18nConfig.defaultLocale) return text;
    if (typeof text !== "string") return text;

    const translated = await translator.translateText(
      text,
      i18nConfig.defaultLocale,
      targetLang === "en" ? "en-US" : targetLang,
      // "context" is alpha feature. it may be deprecated in the future
      // ref: https://github.com/DeepLcom/deepl-node#text-translation-options
      { context: "Web Developer Portfolio Sites" }
    );
    return translated.text;
  }
);
