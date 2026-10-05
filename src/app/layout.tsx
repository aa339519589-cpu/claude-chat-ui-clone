import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const anthropicSans = localFont({
  src: [
    {
      path: "../../public/sites/claude-ai-5502a6be/shared/fonts/anthropic-sans-variable.woff2",
      style: "normal",
      weight: "300 800",
    },
    {
      path: "../../public/sites/claude-ai-5502a6be/shared/fonts/anthropic-sans-variable-italic.woff2",
      style: "italic",
      weight: "300 800",
    },
  ],
  variable: "--font-anthropic-sans",
  display: "swap",
});

const anthropicSerif = localFont({
  src: [
    {
      path: "../../public/sites/claude-ai-5502a6be/shared/fonts/anthropic-serif-variable.woff2",
      style: "normal",
      weight: "300 800",
    },
    {
      path: "../../public/sites/claude-ai-5502a6be/shared/fonts/anthropic-serif-variable-italic.woff2",
      style: "italic",
      weight: "300 800",
    },
  ],
  variable: "--font-anthropic-serif",
  display: "swap",
});

const anthropicMono = localFont({
  src: [
    {
      path: "../../public/sites/claude-ai-5502a6be/shared/fonts/anthropic-mono-variable.woff2",
      style: "normal",
      weight: "300 800",
    },
    {
      path: "../../public/sites/claude-ai-5502a6be/shared/fonts/anthropic-mono-variable-italic.woff2",
      style: "italic",
      weight: "300 800",
    },
  ],
  variable: "--font-anthropic-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude",
  description: "Talk, read, write, code, and create with Claude",
  icons: {
    icon: [{ url: "/sites/claude-ai-5502a6be/shared/seo/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/sites/claude-ai-5502a6be/shared/seo/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#151515",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anthropicSans.variable} ${anthropicSerif.variable} ${anthropicMono.variable} cds-root h-screen antialiased scroll-smooth`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
