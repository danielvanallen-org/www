import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypt Colors",
  description: "Try public key cryptography by mixing paint to share a secret color.",
};

export default function CryptColorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
