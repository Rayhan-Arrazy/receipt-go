import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ExtractedReceiptData {
  storeName: string;
  amount: number;
  date: string; // ISO date string YYYY-MM-DD
  category: string;
  currency: string;
  notes?: string;
}

const RECEIPT_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Health & Medical",
  "Travel",
  "Utilities",
  "Other",
];

export async function extractReceiptData(
  imageBase64: string,
  mimeType: string
): Promise<ExtractedReceiptData> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a receipt data extractor. Analyze this receipt image and extract the following information in JSON format.

Return ONLY valid JSON with these exact fields:
{
  "storeName": "the store or merchant name",
  "amount": the total amount as a number (no currency symbol),
  "date": "YYYY-MM-DD format date",
  "category": "one of: ${RECEIPT_CATEGORIES.join(", ")}",
  "currency": "3-letter currency code like USD, EUR, IDR, GBP",
  "notes": "any other relevant info like order number, items summary (optional, can be empty string)"
}

Rules:
- storeName: Extract the business name clearly. If unclear, use "Unknown Store"
- amount: Extract the TOTAL amount paid. Must be a number, not a string.
- date: Use today's date (${new Date().toISOString().split("T")[0]}) if not visible on receipt
- category: Choose the BEST matching category from the list
- currency: Detect from symbols ($ = USD, € = EUR, £ = GBP, Rp = IDR, etc.)
- Return ONLY the JSON object, no markdown, no explanation`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp",
        data: imageBase64,
      },
    },
    { text: prompt },
  ]);

  const response = result.response;
  const text = response.text().trim();

  // Strip any markdown code blocks if present
  const jsonText = text.replace(/^```json?\n?/i, "").replace(/\n?```$/i, "").trim();

  try {
    const parsed = JSON.parse(jsonText);
    return {
      storeName: String(parsed.storeName || "Unknown Store"),
      amount: parseFloat(String(parsed.amount)) || 0,
      date: String(parsed.date || new Date().toISOString().split("T")[0]),
      category: RECEIPT_CATEGORIES.includes(parsed.category)
        ? parsed.category
        : "Other",
      currency: String(parsed.currency || "USD"),
      notes: parsed.notes ? String(parsed.notes) : undefined,
    };
  } catch {
    throw new Error("Failed to parse extracted receipt data from AI response");
  }
}
