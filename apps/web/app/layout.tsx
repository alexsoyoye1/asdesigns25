import "../styles/globals.css";
import { ReactNode } from "react";
import BrandThemeProvider from "../components/BrandThemeProvider";
import { Inter, Orbitron } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata = {
  title: "ASDesigns",
  description: "ASDesigns — Fusing Aesthetics and Functionality, One Pixel at a Time.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable}`}>
        <BrandThemeProvider>{children}</BrandThemeProvider>
      </body>
    </html>
  );
}
