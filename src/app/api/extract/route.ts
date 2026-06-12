import { NextRequest } from "next/server";
import { extractReceiptData } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are supported." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Convert to base64 for Gemini
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const extractedData = await extractReceiptData(base64, file.type);

    return Response.json({ data: extractedData });
  } catch (error) {
    console.error("Extract API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to extract receipt data";
    return Response.json({ error: message }, { status: 500 });
  }
}
