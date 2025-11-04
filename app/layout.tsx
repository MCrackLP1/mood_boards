import type { Metadata } from "next";
import "./globals.css";
import { ToastProviderWrapper } from "@/components/ToastProviderWrapper";

export const metadata: Metadata = {
  title: "Mood Boards - Visual Timeline Creator",
  description: "Create beautiful mood boards with a cinematic timeline experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-gradient" />
        <ToastProviderWrapper>
          {children}
        </ToastProviderWrapper>
      </body>
    </html>
  );
}

