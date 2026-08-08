import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Investidor Protegido — Carreiras",
  description:
    "Oportunidade de carreira no mercado financeiro e de consórcios. Faça parte do time Investidor Protegido.",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
