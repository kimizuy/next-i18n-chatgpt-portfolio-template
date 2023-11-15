import type { Frontmatter, Locale } from "./types";

const isString = (value: unknown): value is string => typeof value === "string";
const isDate = (value: unknown): value is Date =>
  value instanceof Date ||
  Object.prototype.toString.call(value) === "[Object Date]";
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isUnion =
  (unionChecks: ((value: unknown) => boolean)[]) =>
  (value: unknown): boolean =>
    unionChecks.reduce((s: boolean, isT) => s || isT(value), false);

export const isFrontmatter = (arg_0: unknown): arg_0 is Frontmatter =>
  isObject(arg_0) &&
  "title" in arg_0 &&
  isString(arg_0["title"]) &&
  "publishedAt" in arg_0 &&
  isDate(arg_0["publishedAt"]);
export function assertIsFrontmatter(
  value: unknown
): asserts value is Frontmatter {
  if (!isFrontmatter(value))
    throw new TypeError(`value must be Frontmatter but received ${value}`);
}
export const isLocale = (arg_0: unknown): arg_0 is Locale =>
  isUnion([
    (arg_1: unknown): boolean => arg_1 === "en",
    (arg_1: unknown): boolean => arg_1 === "de",
    (arg_1: unknown): boolean => arg_1 === "ja",
  ])(arg_0);
export function assertIsLocale(value: unknown): asserts value is Locale {
  if (!isLocale(value))
    throw new TypeError(`value must be Locale but received ${value}`);
}
