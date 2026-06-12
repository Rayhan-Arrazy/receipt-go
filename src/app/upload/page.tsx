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
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
                <Receipt className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base leading-none">ReceiptGo</h1>
                <p className="text-slate-500 text-xs">Add New Receipt</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-violet-400 text-sm font-medium">Gemini AI Extraction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Upload Your Receipt
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Take a photo or upload an image. Our AI will automatically read and extract all the details for you.
          </p>
        </div>

        {/* How it works */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { step: "1", label: "Upload", desc: "Photo or file", icon: "📷" },
              { step: "2", label: "AI Reads", desc: "Gemini extracts data", icon: "✨" },
              { step: "3", label: "Save", desc: "Review & confirm", icon: "💾" },
            ].map(({ step, label, desc, icon }) => (
              <div key={step} className="space-y-1">
                <div className="text-2xl">{icon}</div>
                <p className="text-white font-medium text-sm">{label}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
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
