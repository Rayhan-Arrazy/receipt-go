"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Camera, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadedImage {
  file: File;
  preview: string;
}

interface ExtractedData {
  storeName: string;
  amount: number;
  date: string;
  category: string;
  currency: string;
  notes?: string;
}

interface ImageUploaderProps {
  onExtracted: (data: ExtractedData, imageFile: File) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function ImageUploader({ onExtracted, isLoading, setIsLoading }: ImageUploaderProps) {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "uploading" | "extracting" | "done">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG or PNG)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB");
      return;
    }
    const preview = URL.createObjectURL(file);
    setUploadedImage({ file, preview });
    setStage("idle");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleExtract = async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    setStage("uploading");
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", uploadedImage.file);

      setStage("extracting");
      setProgress(50);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      setProgress(90);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Extraction failed");
      }

      setProgress(100);
      setStage("done");
      toast.success("Receipt data extracted successfully! 🎉");
      onExtracted(result.data, uploadedImage.file);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to extract receipt data"
      );
      setStage("idle");
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setStage("idle");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {!uploadedImage ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-4
            border-2 border-dashed rounded-2xl p-10 cursor-pointer
            transition-all duration-300 group bg-white
            ${isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-slate-50"
            }
          `}
        >
          <div className={`
            p-5 rounded-2xl transition-all duration-300
            ${isDragging ? "bg-primary/20" : "bg-slate-100 group-hover:bg-primary/10"}
          `}>
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
          </div>
          <div className="text-center">
            <p className="text-foreground font-semibold text-lg">
              {isDragging ? "Drop your receipt here" : "Upload Receipt Image"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Drag & drop or click to browse
            </p>
            <p className="text-muted-foreground text-xs mt-2">JPEG, PNG, WebP up to 10MB</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border hover:border-primary text-foreground hover:bg-slate-50"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-border bg-slate-50">
            <Image
              src={uploadedImage.preview}
              alt="Receipt preview"
              width={600}
              height={400}
              className="w-full object-contain max-h-72"
            />
            {stage !== "done" && (
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-destructive/90 transition-colors shadow-sm"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            {stage === "done" && (
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-primary/90 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {(stage === "uploading" || stage === "extracting") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {stage === "uploading" ? "Preparing image..." : "AI is reading your receipt..."}
                </span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-primary/10" />
            </div>
          )}

          {stage === "idle" && (
            <Button
              id="extract-btn"
              onClick={handleExtract}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Extract with AI
            </Button>
          )}

          {stage === "done" && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <p className="text-primary text-sm font-medium">
                Data extracted! Review and save below.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
