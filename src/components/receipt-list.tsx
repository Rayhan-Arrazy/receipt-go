"use client";

import { useState, useEffect, useCallback } from "react";
import { ReceiptCard } from "@/components/receipt-card";
import { SpendingCharts } from "@/components/spending-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Receipt, LayoutGrid, List } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface Receipt {
  id: string;
  storeName: string;
  amount: number;
  date: string;
  category: string;
  imageUrl: string | null;
  notes: string | null;
  currency: string;
  createdAt: string;
}

interface ReceiptListProps {
  initialReceipts: Receipt[];
}

export function ReceiptList({ initialReceipts }: ReceiptListProps) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [filtered, setFiltered] = useState<Receipt[]>(initialReceipts);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"receipts" | "charts">("receipts");

  const applyFilters = useCallback(() => {
    let result = receipts;

    if (category !== "all") {
      result = result.filter((r) => r.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.storeName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [receipts, category, search]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDelete = (id: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 text-center border-border">
          <p className="text-2xl font-bold text-foreground">{receipts.length}</p>
          <p className="text-muted-foreground text-xs mt-1">Total Receipts</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center border-border">
          <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
          <p className="text-muted-foreground text-xs mt-1">Filtered</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center border-border">
          <p className="text-lg font-bold text-primary">
            ${totalAmount.toFixed(0)}
          </p>
          <p className="text-muted-foreground text-xs mt-1">Total Spent</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-border">
        <button
          id="tab-receipts"
          onClick={() => setActiveTab("receipts")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "receipts"
              ? "bg-white text-primary shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="w-4 h-4" />
          Receipts
        </button>
        <button
          id="tab-charts"
          onClick={() => setActiveTab("charts")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "charts"
              ? "bg-white text-primary shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Filter className="w-4 h-4" />
          Analytics
        </button>
      </div>

      {activeTab === "receipts" ? (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="search-receipts"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search receipts..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
              <SelectTrigger
                id="category-filter"
                className="w-full sm:w-48 bg-white border-border text-foreground shadow-sm"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="hover:text-primary text-foreground">
                  All Categories
                </SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="hover:text-primary text-foreground">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-border rounded-xl">
              <button
                id="view-grid"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="view-list"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Receipt Grid/List */}
          {filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center border-border">
              <div className="p-5 rounded-2xl bg-slate-100">
                <Receipt className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground font-semibold text-lg">No receipts found</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {receipts.length === 0
                    ? "Upload your first receipt to get started"
                    : "Try adjusting your filters"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {filtered.map((receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <SpendingCharts receipts={receipts} />
      )}
    </div>
  );
}
