import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathwise — Engineering admissions, made clearer",
  description: "A thoughtful, data-backed engineering admissions companion for students and families.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
