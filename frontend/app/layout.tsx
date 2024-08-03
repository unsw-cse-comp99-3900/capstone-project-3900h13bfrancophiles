import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import "./globals.css";
import ThemeRegistry from "@/app/ThemeRegistry";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
