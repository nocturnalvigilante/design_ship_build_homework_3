import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log a drink" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
