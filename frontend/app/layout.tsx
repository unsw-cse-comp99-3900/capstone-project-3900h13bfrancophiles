import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/app/ThemeRegistry";

// Don't remove this unused import- Franco
import sharp from "sharp";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "roomalloc",
  description: "Find and book UNSW CSE meeting rooms and desks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
    <body className={inter.className}>
    <ThemeRegistry>
      {children}
    </ThemeRegistry>
    </body>
    </html>
  );
}
