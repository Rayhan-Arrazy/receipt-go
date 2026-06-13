export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, Receipt, Sparkles } from "lucide-react";
import { ReceiptForm } from "@/components/receipt-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Receipt – ReceiptGo",
  description: "Upload a receipt image and let AI automatically extract the spending data.",
};

export default function UploadPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-white/80">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/25">
                <Receipt className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-foreground font-bold text-base leading-none">ReceiptGo</h1>
                <p className="text-muted-foreground text-xs">Add New Receipt</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full font-medium">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Gemini AI Extraction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Upload Your Receipt
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Take a photo or upload an image. Our AI will automatically read and extract all the details for you.
          </p>
        </div>

        {/* How it works */}
        <div className="glass-card rounded-2xl p-4 mb-6 border-border">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { step: "1", label: "Upload", desc: "Photo or file", icon: "📷" },
              { step: "2", label: "AI Reads", desc: "Gemini extracts data", icon: "✨" },
              { step: "3", label: "Save", desc: "Review & confirm", icon: "💾" },
            ].map(({ step, label, desc, icon }) => (
              <div key={step} className="space-y-1">
                <div className="text-2xl">{icon}</div>
                <p className="text-foreground font-semibold text-sm">{label}</p>
                <p className="text-muted-foreground text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <ReceiptForm />
      </main>
    </div>
  );
}
