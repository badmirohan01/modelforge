import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ModelForge | Production-Ready Model Inference",
  description: "Deploy, manage, and scale your machine learning models with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark antialiased`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-white/10 selection:text-white">
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="top-right" theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
