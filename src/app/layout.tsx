import type { Metadata } from "next";
import { Source_Sans_3, Source_Code_Pro } from "next/font/google";
import { ClientLayout } from "@/components/client-layout";
import "./globals.css";

const sourceSans = Source_Sans_3({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Hunt Admin Panel",
  description: "Panel de administración para eventos de Hunt Tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${sourceSans.variable} ${sourceCodePro.variable} font-sans antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
