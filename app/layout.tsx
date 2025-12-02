import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Outsyde - Discover & Buy Event Tickets",
  description: "The best place to find and buy tickets for your favorite events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-full bg-spotify-black min-h-screen">
            <Sidebar />
            {/* Desktop: margin-left for sidebar, Mobile: no margin */}
            <div className="flex-1 flex flex-col md:ml-[250px]">
              <Header />
              {/* Mobile: padding-bottom for bottom nav, Desktop: no extra padding */}
              <main className="flex-1 overflow-y-auto bg-spotify-black p-4 md:p-6 pb-20 md:pb-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
