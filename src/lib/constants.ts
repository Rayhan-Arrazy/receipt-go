export const CATEGORIES = [
  { value: "Food & Dining", label: "🍽️ Food & Dining", color: "#f97316" },
  { value: "Groceries", label: "🛒 Groceries", color: "#22c55e" },
  { value: "Shopping", label: "🛍️ Shopping", color: "#8b5cf6" },
  { value: "Transportation", label: "🚗 Transportation", color: "#3b82f6" },
  { value: "Entertainment", label: "🎬 Entertainment", color: "#ec4899" },
  { value: "Health & Medical", label: "💊 Health & Medical", color: "#14b8a6" },
  { value: "Travel", label: "✈️ Travel", color: "#f59e0b" },
  { value: "Utilities", label: "⚡ Utilities", color: "#6366f1" },
  { value: "Other", label: "📦 Other", color: "#64748b" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function getCategoryColor(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.color ?? "#64748b";
}

export function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function formatCurrency(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
