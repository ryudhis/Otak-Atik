import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import AOSInit from "./components/AOSInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Otak Atik",
  description: "Aplikasi Belajar Untuk Semua",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='dicoding:email' content='juantanuwijaya@gmail.com' />
      </head>
      <body className={`${inter.className} h-screen bg-tertiary text-white`}>
        <AOSInit />
        {children}
        <ToastContainer theme='dark' />
      </body>
    </html>
  );
}
