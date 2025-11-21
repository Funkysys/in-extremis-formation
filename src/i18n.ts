import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(
  async ({
    locale,
  }): Promise<{ locale: string; messages: Record<string, string> }> => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as Locale)) notFound();

    return {
      locale: locale as string,
      messages: (await import(`../messages/${locale}.json`)).default as Record<
        string,
        string
      >,
    };
  }
);
