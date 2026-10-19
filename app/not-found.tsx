import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  alternates: {
    canonical: null,
  },
};

export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>This page could not be found.</p>
    </main>
  );
}
