import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

import Providers from "@/providers/Providers";

const onest = Onest({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "File Storage Registry | shadcn Component",
  description: "A complete file storage system with AWS S3 and Cloudflare R2 support. Install via shadcn CLI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={onest.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
