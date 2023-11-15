import OpenAI from "openai";
import { Locale } from "./types";
import { i18nConfig, languages } from "./i18n-config";
import { isOpenAiResult } from "./type-predicates";
import { getErrorMessage } from "./helpers";

const CONTEXT = "a web developer portfolio site";
const JSON_FORMAT = `{"result": [value]}`;

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const translateWithChatGPT = async (
  text: string,
  targetLang: Locale
) => {
  if (i18nConfig.defaultLocale === targetLang) return text;
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "user",
          content: `Please translate the following ${
            languages[i18nConfig.defaultLocale]
          } text into ${
            languages[targetLang]
          }, keeping in mind that it will be used in ${CONTEXT}. Output the translation in JSON format: \`${JSON_FORMAT}\`. The text is: "${text}"`,
        },
      ],
      response_format: { type: "json_object" },
    });
    const content = chatCompletion.choices[0].message?.content;
    if (!content) throw new Error("ChatGPT returned no content.");
    const parsedContent = JSON.parse(content);
    if (isOpenAiResult(parsedContent)) {
      return parsedContent.result;
    } else {
      throw new Error("ChatGPT did not return a valid result.");
    }
  } catch (error) {
    console.error(getErrorMessage(error));
    process.exit(1);
  }
};
