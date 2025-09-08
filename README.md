# Next.js i18n Boilerplate

A robust and modern Next.js 14 boilerplate designed for rapid development of scalable web applications, featuring comprehensive internationalization, secure authentication, and a clean, modular architecture.

## Table of Contents

-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Running the Project](#running-the-project)
-   [Next.js Internationalization (`next-intl`) Explanation](#nextjs-internationalization-next-intl-explanation)
    -   [1. Message Loading (`i18n/request.ts`)](#1-message-loading-i18nrequestts)
    -   [2. Routing (`i18n/routing.ts`, `hooks/useI18nRouting.ts`)](#2-routing-i18nroutingts-hooksusei18nroutingts)
    -   [3. Using Translations in Components (`useTranslations` hook)](#3-using-translations-in-components-usetranslations-hook)
-   [NextAuth.js Integration](#nextauthjs-integration)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   **Next.js 14 App Router:** Built with the latest Next.js App Router, leveraging Server Components and optimized rendering for superior performance and a streamlined development experience.
-   **Internationalization (i18n):** Comprehensive multi-language support powered by `next-intl`, enabling seamless localization of content and URL routing for a global audience.
-   **NextAuth.js:** Secure and flexible authentication system integrated with NextAuth.js, supporting popular OAuth providers like Google, GitHub, and Facebook.
-   **Modern UI with Tailwind CSS:** A clean, responsive, and highly customizable user interface built with Tailwind CSS, ensuring a consistent and visually appealing design across devices.
-   **Global Footer:** A consistent and modern footer that appears on every page of the application, providing essential information and branding.
-   **Consistent Content Container:** All main content areas across the website adhere to a defined maximum width and horizontal padding, ensuring a visually balanced and readable layout.
-   **Modern Font:** Utilizes a carefully selected modern sans-serif font (Inter) for enhanced readability and a contemporary aesthetic.
-   **Modular Structure:** The codebase is organized into logical modules (components, hooks, lib, store, types) promoting maintainability, scalability, and reusability.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/): v18.x or higher
-   [pnpm](https://pnpm.io/): (Recommended) or npm/yarn
-   [Git](https://git-scm.com/): For cloning the repository

## Getting Started

Follow these steps to get your development environment set up.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nextjs-i18n-app
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install # or npm install or yarn install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project. This file will store sensitive information and API keys.

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here # Generate a strong secret: openssl rand -base64 32

# OAuth Providers
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Development Configuration
NODE_ENV=development
```
**Important:** Replace placeholder values (`your_actual_...`) with your actual credentials obtained from the respective OAuth provider's developer consoles.

### Running the Project

To start the development server:

```bash
pnpm dev # or npm run dev or yarn dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Next.js Internationalization (`next-intl`) Explanation

This project leverages `next-intl` for comprehensive internationalization, enabling multi-language support and localized routing.

### 1. Message Loading (`i18n/request.ts`)

The `i18n/request.ts` file is the entry point for loading translation messages based on the requested locale.

-   It uses `getRequestConfig` from `next-intl/server` to dynamically import the `common.json` file for the active locale from the `public/locales` directory.
-   This setup ensures that only the necessary translation messages for the current locale are loaded on the server, optimizing performance by reducing the bundle size sent to the client.
-   All translation keys are expected to reside within the `common.json` file for each locale (e.g., `public/locales/en/common.json`, `public/locales/fr/common.json`).

```typescript
// i18n/request.ts
import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../public/locales/${locale}/common.json`)).default,
  }
})
```

### 2. Routing (`i18n/routing.ts`, `hooks/useI18nRouting.ts`)

Localized routing is managed through a combination of `i18n/routing.ts` and a custom `useI18nRouting` hook.

-   **`i18n/routing.ts`:** This file defines the core routing configuration for `next-intl`.
    -   `locales`: An array specifying all supported language locales (e.g., "en", "fr", "es", "bn"). These must correspond to your translation file structure.
    -   `defaultLocale`: The fallback locale used when no specific locale is matched in the URL or detected from user preferences.
    -   It uses `defineRouting` to encapsulate this configuration.

    ```typescript
    // i18n/routing.ts
    import { defineRouting } from "next-intl/routing"

    export const routing = defineRouting({
      locales: ["en", "fr", "es", "bn"],
      defaultLocale: "en",
    })
    ```

-   **`hooks/useI18nRouting.ts`:** This custom React hook provides a convenient way to handle localized navigation within client components.
    -   It uses `useLocale` from `next-intl` to get the current active locale.
    -   It wraps Next.js's `useRouter` to automatically prepend the current locale to paths when using `push` or `replace` methods. This ensures all internal links respect the active language without manual path construction in components.

    ```typescript
    // hooks/useI18nRouting.ts
    "use client"

    import { useLocale } from "next-intl"
    import { useRouter } from "next/navigation" // Note: This is Next.js's useRouter, not next-intl's
    import { useCallback } from "react"

    export function useI18nRouting() {
      const locale = useLocale()
      const router = useRouter()

      const push = useCallback(
        (href: string) => {
          const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href
          router.push(localizedHref)
        },
        [locale, router],
      )

      const replace = useCallback(
        (href: string) => {
          const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href
          router.replace(localizedHref)
        },
        [locale, router],
      )

      return {
        push,
        replace,
        locale,
      }
    }
    ```

### 3. Using Translations in Components (`useTranslations` hook)

Translations are accessed in React components using the `useTranslations` hook from `next-intl`.

-   When `useTranslations()` is called without a namespace (as shown in the `Navbar.tsx` example below), you must provide the full path to the translation key (e.g., `navigation.home`, `actions.signIn`). This approach ensures clarity and avoids conflicts when multiple translation domains are present in `common.json`.
-   Alternatively, you can specify a namespace (e.g., `useTranslations("auth")`) to use shorter keys relative to that namespace (e.g., `t("signIn")`). This project primarily uses the no-namespace approach for simplicity with a single `common.json` file.

```typescript
// components/nav/Navbar.tsx (Example)
import { useTranslations } from "next-intl"
import { useI18nRouting } from "@/hooks/useI18nRouting" // For push/replace

export function Navbar() {
  const t = useTranslations() // No namespace specified, so full paths are used
  const { push } = useI18nRouting()

  return (
    // ...
    <button onClick={() => push("/")}>{t("navigation.home")}</button>
    <button onClick={() => push("/about")}>{t("navigation.about")}</button>
    <button onClick={() => push("/sign-in")}>{t("actions.signIn")}</button>
    // ...
  )
}
```

## NextAuth.js Integration

This boilerplate integrates NextAuth.js for robust authentication.

-   **Configuration (`lib/auth.ts`):** The `authOptions` in `lib/auth.ts` define the authentication providers (Google, GitHub, Facebook) and callbacks for JWT and session management.
-   **Providers:** OAuth providers are conditionally included based on the presence of their respective environment variables (`GOOGLE_CLIENT_ID`, `GITHUB_ID`, `FACEBOOK_CLIENT_ID`, etc.).
-   **Callbacks:**
    -   `jwt` callback: Modifies the JWT token (e.g., adds user roles).
    -   `session` callback: Extends the session object with custom user data.
    -   `signIn` callback (commented out example): Demonstrates how to implement custom backend token verification before allowing a user to sign in. This is a powerful feature for implementing custom authorization logic.

## Project Structure

The project follows a clear and modular structure to enhance maintainability and scalability:

```
.
├── app/                  # Next.js App Router pages, layouts, and API routes.
│   └── [locale]/         # Localized pages and layouts for different languages.
├── components/           # Reusable UI components, categorized by feature or type.
│   ├── auth/             # Authentication-related components (e.g., SignInForm, AuthGuard).
│   ├── common/           # General-purpose components (e.g., LanguageSwitcher).
│   ├── layout/           # Layout-specific components (e.g., AppShell).
│   └── ui/               # Shadcn/ui components or custom UI primitives.
├── hooks/                # Custom React hooks for reusable logic (e.g., useI18nRouting, useUI).
├── i18n/                 # Configuration and utilities for next-intl (routing, message loading).
├── lib/                  # Utility functions, API clients, and NextAuth.js configuration.
│   └── api/              # API service definitions.
├── public/               # Static assets (images, fonts) and locale-specific JSON translation files.
│   └── locales/          # Organized by locale (e.g., en/, fr/).
├── store/                # Jotai state management atoms and related logic.
├── styles/               # Global CSS styles and Tailwind CSS configuration.
└── types/                # TypeScript type definitions for the entire application.
```

## Contributing

Contributions are highly welcome! If you have suggestions, bug reports, or want to contribute code, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).