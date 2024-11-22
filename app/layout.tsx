import { ReactNode } from "react";
import StoreProvider from "../AppProvider";
import "./globals.css";
import dynamic from "next/dynamic";

const DynamicStoreProvider = dynamic(() => import("../AppProvider"), {
  ssr: false, // Disable server-side rendering
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DynamicStoreProvider>{children} </DynamicStoreProvider>
      </body>
    </html>
  );
}
