import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ComputeShare - Monetize Your CPU/GPU Cycles",
  description: "A platform for sharing computational resources and earning rewards through instant micropayments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-gray-800 py-4">
              <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold text-xl">ComputeShare</span>
                </div>
                <nav className="hidden md:flex gap-6">
                  <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
                  <a href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</a>
                  <a href="/marketplace" className="hover:text-blue-400 transition-colors">Marketplace</a>
                </nav>
                <div>
                  <a
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="border-t border-gray-800 py-6">
              <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                <p>© {new Date().getFullYear()} ComputeShare. Powered by Radius Blockchain.</p>
              </div>
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
