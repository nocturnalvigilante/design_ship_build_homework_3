import type { Metadata } from "next";

export const metadata: Metadata = { title: "When are you sleeping next?" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
