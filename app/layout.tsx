import "./globals.css";

import { applyDarkMode } from "./dark-mode";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daniel Van Allen",
  description: "Daniel Van Allen contact information and projects.",
  metadataBase: new URL("https://danielvanallen.org"),
};

// Applying dark mode with next/script beforeInteractive causes a flash.
// https://github.com/vercel/next.js/issues/43402
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning={true}
      lang="en"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${applyDarkMode.toString()})();`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
