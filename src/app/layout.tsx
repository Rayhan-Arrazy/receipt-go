import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ReceiptGo – Smart Receipt Scanner & Expense Tracker",
  description:
    "Upload receipt photos and let AI automatically extract store name, amount, date, and category. Track your spending with beautiful charts and summaries.",
  keywords: ["receipt scanner", "expense tracker", "AI receipt", "spending tracker"],
  openGraph: {
    title: "ReceiptGo – Smart Receipt Scanner",
    description: "AI-powered receipt scanning and expense tracking",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased gradient-bg min-h-screen">
        {children}
        <Toaster
          position="top-right"
          theme="light"
        />
      </body>
    </html>
  );
}
