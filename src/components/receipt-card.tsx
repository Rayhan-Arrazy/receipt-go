"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Calendar, Tag, ImageOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCategoryColor, formatCurrency, formatDate } from "@/lib/constants";

interface Receipt {
  id: string;
  storeName: string;
  amount: number;
  date: string | Date;
  category: string;
  imageUrl: string | null;
  notes: string | null;
  currency: string;
  createdAt: string | Date;
}

interface ReceiptCardProps {
  receipt: Receipt;
  onDelete: (id: string) => void;
}

export function ReceiptCard({ receipt, onDelete }: ReceiptCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const categoryColor = getCategoryColor(receipt.category);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/receipts/${receipt.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete receipt");
      }

      toast.success("Receipt deleted");
      onDelete(receipt.id);
    } catch {
      toast.error("Failed to delete receipt");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="group glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
        {/* Receipt Image */}
        <div className="relative h-36 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          {receipt.imageUrl && !imageError ? (
            <Image
              src={receipt.imageUrl}
              alt={`Receipt from ${receipt.storeName}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageOff className="w-8 h-8 text-slate-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category badge on image */}
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full text-white backdrop-blur-sm"
              style={{ backgroundColor: `${categoryColor}cc` }}
            >
              {receipt.category}
            </span>
          </div>

          {/* Image link */}
          {receipt.imageUrl && !imageError && (
            <a
              href={receipt.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-base leading-tight truncate">
              {receipt.storeName}
            </h3>
            <button
              id={`delete-${receipt.id}`}
              onClick={() => setShowDeleteDialog(true)}
              className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Delete receipt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              {formatCurrency(receipt.amount, receipt.currency)}
            </span>
            <Badge
              variant="outline"
              className="border-white/10 text-slate-400 text-xs"
            >
              {receipt.currency}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(receipt.date)}</span>
          </div>

          {receipt.notes && (
            <div className="flex items-start gap-1.5 text-slate-500 text-xs">
              <Tag className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{receipt.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Receipt?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete the receipt from{" "}
              <span className="text-white font-medium">{receipt.storeName}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="border-white/10 hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              id={`confirm-delete-${receipt.id}`}
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
