import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authcontext";

export const metadata: Metadata = {
  title: "Gestão de Resíduos - SINIR",
  description: "Ferramenta de análise para gestão de resíduos integrada ao SINIR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang={`pt-BR`}>
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
