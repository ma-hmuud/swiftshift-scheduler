import "~/styles/globals.css";

import { type Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import { AppProviders } from "~/app/_components/app-providers";
import { cn } from "~/lib/utils";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Swift Shift - Employee Scheduler",
  description:
    "Calendar-native employee scheduling with clear workflows and faster approvals.",
  icons: {
    icon: [{ url: "/logos/dark-logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/logos/dark-logo.jpg" }],
    shortcut: "/logos/dark-logo.jpg",
  },
};

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
      className={cn(sans.variable, display.variable, "font-sans", "dark")}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: darkOnlyScript }} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
