import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const stylish = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-stylish" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "ModelForge | Production-Ready Model Inference",
  description: "Deploy, manage, and scale your machine learning models with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${stylish.variable} ${mono.variable} dark antialiased`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-white/10 selection:text-white">
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="top-right" theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
