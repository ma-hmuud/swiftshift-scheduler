import "~/styles/globals.css";

import { type Metadata } from "next";
import { Cormorant_Garamond, Manrope, Geist } from "next/font/google";

import { AppProviders } from "~/app/_components/app-providers";
import { cn } from "~/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Swift Shift - Employee Scheduler",
  description:
    "Modern employee scheduling with clear workflows and faster approvals.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const darkOnlyScript = `
(() => {
  document.documentElement.classList.add("dark");
  document.documentElement.style.colorScheme = "dark";
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        display.variable,
        body.variable,
        "font-sans",
        geist.variable,
        "dark",
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: darkOnlyScript }} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
