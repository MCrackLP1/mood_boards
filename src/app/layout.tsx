import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { BoardProvider } from "@/lib/BoardContext";
import SmoothScroller from "@/components/SmoothScroller";
import Signature from "@/components/Signature";

export const metadata: Metadata = {
  title: "Moodboards | Mark Tietz Fotografie",
  description: "Creative moodboards by Mark Tietz Fotografie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-50 text-gray-800">
      <body className={GeistSans.className}>
        <BoardProvider>
          <SmoothScroller>
            {children}
            <Signature />
          </SmoothScroller>
        </BoardProvider>
      </body>
    </html>
  );
}
