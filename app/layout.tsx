// app/layout.tsx (or wherever you define your RootLayout)

import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./AppProvider";

export const metadata: Metadata = {
  title: "skribbl",
  description: "clone of skribbl.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StoreProvider>{children}</StoreProvider>;
}
