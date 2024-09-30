import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BookProvider } from "./components/bookstore/BookContext";
import dynamic from "next/dynamic";

const WalletConnectionProvider = dynamic(
  () => import("./components/WalletConnectionProvider"),
  { ssr: false }
);

// Remove WalletConnectButton import as it's no longer needed here

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
              <main className="flex-grow">{children}</main>
            </div>
          </BookProvider>
        </WalletConnectionProvider>
      </body>
    </html>
  );
}
