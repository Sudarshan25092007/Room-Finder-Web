import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar";
import { ToastProvider } from "@/app/components/ui/ToastProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomFinder",
  description: "Find rooms and manage your listings",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-zinc-50 antialiased`}
    >
      <body>
        <ToastProvider>
          <Navbar />
          <main className="py-6">
            <div className="rf-container">{children}</div>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
