"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/image-uploader";
import { uploadReceiptImage } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/constants";

interface ExtractedData {
  storeName: string;
  amount: number;
  date: string;
  category: string;
  currency: string;
  notes?: string;
}

interface ReceiptFormData {
  storeName: string;
  amount: string;
  date: string;
  category: string;
  currency: string;
  notes: string;
}

const DEFAULT_FORM: ReceiptFormData = {
  storeName: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  category: "",
  currency: "USD",
  notes: "",
};

export function ReceiptForm() {
  const router = useRouter();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ReceiptFormData>(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isExtracted, setIsExtracted] = useState(false);

  const handleExtracted = (data: ExtractedData, file: File) => {
    setFormData({
      storeName: data.storeName,
      amount: data.amount.toString(),
      date: data.date,
      category: data.category,
      currency: data.currency,
      notes: data.notes || "",
    });
    setImageFile(file);
    setIsExtracted(true);
  };

  const handleField = (field: keyof ReceiptFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.storeName || !formData.amount || !formData.date || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        toast.info("Uploading image...");
        imageUrl = await uploadReceiptImage(imageFile);
      }

      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: formData.storeName,
          amount,
          date: formData.date,
          category: formData.category,
          currency: formData.currency,
          notes: formData.notes || undefined,
          imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string" ? result.error : "Failed to save receipt"
        );
      }

      toast.success("Receipt saved successfully! 🎉");
      setFormData(DEFAULT_FORM);
      setImageFile(null);
      setIsExtracted(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save receipt"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setImageFile(null);
    setIsExtracted(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload Section */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Receipt Image</h2>
          {isExtracted && (
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
        <ImageUploader
          onExtracted={handleExtracted}
          isLoading={isExtracting}
          setIsLoading={setIsExtracting}
        />
      </div>

      {/* Form Fields Section */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Receipt Details</h2>
          {isExtracted && (
            <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
              ✨ AI Extracted
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-slate-300">
              Store Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="storeName"
              value={formData.storeName}
              onChange={(e) => handleField("storeName", e.target.value)}
              placeholder="e.g. Walmart, McDonald's"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
              required
            />
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="amount" className="text-slate-300">
                Amount <span className="text-red-400">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleField("amount", e.target.value)}
                placeholder="0.00"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-slate-300">
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(v) => handleField("currency", v ?? "USD")}
              >
                <SelectTrigger id="currency" className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {["USD", "EUR", "GBP", "IDR", "JPY", "SGD", "AUD", "CAD"].map((c) => (
                    <SelectItem key={c} value={c} className="text-slate-200 hover:text-white">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-300">
              Date <span className="text-red-400">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleField("date", e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-violet-500 focus:ring-violet-500/20 [color-scheme:dark]"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-300">
              Category <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(v) => handleField("category", v ?? "")}
            >
              <SelectTrigger id="category" className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                    className="text-slate-200 hover:text-white"
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-300">
              Notes <span className="text-slate-500 text-xs">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleField("notes", e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        id="save-receipt-btn"
        type="submit"
        disabled={isSaving || isExtracting}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-[1.01] disabled:opacity-50 disabled:scale-100"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving Receipt...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Receipt
          </>
        )}
      </Button>
    </form>
  );
}
