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
      <div className="group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
        {/* Receipt Image */}
        <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
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
              <ImageOff className="w-8 h-8 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80" />

          {/* Category badge on image */}
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full text-white backdrop-blur-sm"
              style={{ backgroundColor: `${categoryColor}ee` }}
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
            <h3 className="font-semibold text-foreground text-base leading-tight truncate">
              {receipt.storeName}
            </h3>
            <button
              id={`delete-${receipt.id}`}
              onClick={() => setShowDeleteDialog(true)}
              className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Delete receipt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(receipt.amount, receipt.currency)}
            </span>
            <Badge
              variant="outline"
              className="border-border text-muted-foreground text-xs"
            >
              {receipt.currency}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
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
        <DialogContent className="bg-white border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Receipt?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete the receipt from{" "}
              <span className="text-foreground font-medium">{receipt.storeName}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="border-border hover:bg-slate-100 text-foreground"
            >
              Cancel
            </Button>
            <Button
              id={`confirm-delete-${receipt.id}`}
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
