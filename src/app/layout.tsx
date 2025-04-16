'use client'

import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/services/queryClient";

// export const metadata: Metadata = {
//   title: "Gestão de Resíduos - SINIR",
//   description: "Ferramenta de análise para gestão de resíduos integrada ao SINIR",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang={`pt-BR`}>
        <body>{children}</body>
      </html>
    </QueryClientProvider>
  );
}
