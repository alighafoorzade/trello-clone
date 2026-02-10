import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "A simple Trello-like board built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-root">{children}</div>
      </body>
    </html>
  );
}
