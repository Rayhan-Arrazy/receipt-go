export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, Receipt, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReceiptList } from "@/components/receipt-list";

async function getReceipts() {
  try {
    const receipts = await prisma.receipt.findMany({
      orderBy: { date: "desc" },
    });
    return receipts.map((r) => ({
      ...r,
      date: r.date.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch receipts:", error);
    return [];
  }
}

export default async function HomePage() {
  const receipts = await getReceipts();

  const totalSpending = receipts.reduce((sum, r) => sum + r.amount, 0);
  const thisMonth = new Date();
  const monthlyReceipts = receipts.filter((r) => {
    const d = new Date(r.date);
    return (
      d.getMonth() === thisMonth.getMonth() &&
      d.getFullYear() === thisMonth.getFullYear()
    );
  });
  const monthlyTotal = monthlyReceipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">ReceiptGo</h1>
              <p className="text-slate-500 text-xs">AI-Powered Tracker</p>
            </div>
          </div>

          <Link
            id="add-receipt-btn"
            href="/upload"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-105 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Receipt
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-slate-900/40 border border-violet-500/20 p-8 mb-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="text-violet-400 text-sm font-medium">AI-Powered</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Smart Expense{" "}
              <span className="gradient-text">Tracking</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md">
              Upload a receipt photo and our AI instantly extracts store name, amount, date, and category.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{receipts.length}</p>
                <p className="text-slate-400 text-xs">Total Receipts</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-violet-400">
                  ${totalSpending.toFixed(0)}
                </p>
                <p className="text-slate-400 text-xs">All Time</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-indigo-400">
                  ${monthlyTotal.toFixed(0)}
                </p>
                <p className="text-slate-400 text-xs">This Month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt List */}
        <ReceiptList initialReceipts={receipts} />
      </main>
    </div>
  );
}
