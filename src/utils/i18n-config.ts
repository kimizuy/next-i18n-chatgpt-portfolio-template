export const i18nConfig = {
  locales: ["en", "de", "ja"],
  defaultLocale: "ja",
} as const;

export const languages: Record<(typeof i18nConfig)["locales"][number], string> =
  {
    ja: "Japanese",
    en: "English",
    de: "German",
  };
