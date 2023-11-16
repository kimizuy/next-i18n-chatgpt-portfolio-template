import OpenAI from "openai";
import { Locale } from "./types";
import { i18nConfig, languages } from "./i18n-config";
import { isOpenAiResult } from "./type-predicates";
import { getErrorMessage } from "./helpers";
import { cache } from "react";

const CONTEXT =
  "the text of a .md or .mdx file from a web developer's portfolio site";
const JSON_FORMAT = `{"result": "translated text"}`;

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const translateWithChatGPT = cache(
  async (text: string, targetLang: Locale) => {
    if (i18nConfig.defaultLocale === targetLang) return text;
    const content = `Please translate the following ${
      languages[i18nConfig.defaultLocale]
    } text into ${
      languages[targetLang]
    }, keeping in mind that it will be used in ${CONTEXT}. Output the translation in JSON format: \`${JSON_FORMAT}\`. The text is: "${text}"`;

    try {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          {
            role: "user",
            content,
          },
        ],
        response_format: { type: "json_object" },
      });
      const response = chatCompletion.choices[0].message?.content;
      if (!response) throw new Error("ChatGPT returned no content.");
      const parsed = JSON.parse(response);
      if (isOpenAiResult(parsed)) {
        return parsed.result;
      } else {
        throw new Error(`ChatGPT did not return a valid result.

        The result was: ${JSON.stringify(parsed, null, 2)}
        `);
      }
    } catch (error) {
      console.error(getErrorMessage(error));
      process.exit(1);
    }
  }
);
