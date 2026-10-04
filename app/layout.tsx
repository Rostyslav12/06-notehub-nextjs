import type { Metadata } from "next";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Application for managing personal notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <div className="page">
            <Header />

            <main className="content">{children}</main>

            <Footer />
          </div>
        </TanStackProvider>
      </body>
    </html>
  );
}