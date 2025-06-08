'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/client";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <ApolloProvider client={client}>
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                {children}
            </main>
        </ApolloProvider>
      </body>
    </html>
  );
}