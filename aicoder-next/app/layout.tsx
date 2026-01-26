// External imports
import type { Metadata } from "next";
// CSS imports
import "./globals.css";
import "./main.css";

// Metadata for the application
export const metadata: Metadata = {
  title: "AI Code Improver Pro",
  description: "Professional AI-powered code analysis and improvement tool",
};

// Root layout component for the application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Render the layout with children components
  return (
    <html lang="en">
      <body className="antialiased bg-secondary">
        {children}
      </body>
    </html>
  );
}