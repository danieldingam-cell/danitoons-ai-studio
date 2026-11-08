
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DaniToons AI Studio",
  description:
    "Create amazing AI cartoons, animated stories and children's videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

