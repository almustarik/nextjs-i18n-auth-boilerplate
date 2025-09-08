import { defineRouting } from "next-intl/routing"

/**
 * @module i18n/routing
 * @description This module defines the routing configuration for internationalization using `next-intl`.
 * It specifies the supported locales and the default locale. This configuration is crucial for
 * `next-intl` to correctly route requests and manage localized content across the application.
 */

export const routing = defineRouting({
  /**
   * @property {Array<string>} locales - A comprehensive list of all language locales that the application supports.
   * Each string in this array represents a unique locale (e.g., "en" for English, "fr" for French).
   * These locales are used by `next-intl` to:
   * 1. Validate incoming requests: Ensures that only requests for supported locales are processed.
   * 2. Generate localized URLs: Automatically prefixes URLs with the appropriate locale (e.g., `/en/dashboard`, `/fr/about`).
   * 3. Load corresponding translation files: Maps the locale to the correct translation JSON file
   *    (e.g., `public/locales/en/common.json`).
   * It is essential that the locales listed here match the structure of your translation files.
   */
  locales: ["en", "fr", "es", "bn"],

  /**
   * @property {string} defaultLocale - Specifies the fallback locale for the application.
   * This locale is automatically used in the following scenarios:
   * 1. When an incoming request does not specify a locale in the URL.
   * 2. When the detected locale from the user's browser preferences is not among the `locales` array.
   * 3. As a base for generating URLs when `localePrefix` is set to 'as-needed' (though not directly configured here).
   * The `defaultLocale` must be one of the values present in the `locales` array to ensure consistency.
   */
  defaultLocale: "en",
});