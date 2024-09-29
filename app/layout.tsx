import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BookProvider } from "./components/bookstore/BookContext";
import dynamic from "next/dynamic";

const WalletConnectionProvider = dynamic(
  () => import("./components/WalletConnectionProvider"),
  { ssr: false }
);

const WalletConnectButton = dynamic(
  () => import("./components/WalletConnectButton"),
  { ssr: false }
);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "OpenShelf",
  description: "Decentralized book publishing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletConnectionProvider>
          <BookProvider>
            <div className="flex flex-col min-h-screen">
              <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    OpenShelf
                  </h1>
                  <WalletConnectButton />
                </div>
              </header>
              <main className="flex-grow">{children}</main>
            </div>
          </BookProvider>
        </WalletConnectionProvider>
      </body>
    </html>
  );
}
