import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createReceiptSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
  currency: z.string().default("USD"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const month = searchParams.get("month"); // format: YYYY-MM

    const where: Record<string, unknown> = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);
      where.date = { gte: startDate, lte: endDate };
    }

    const receipts = await prisma.receipt.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return Response.json({ receipts });
  } catch (error) {
    console.error("GET receipts error:", error);
    return Response.json({ error: "Failed to fetch receipts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createReceiptSchema.safeParse(body);

    if (!validated.success) {
      return Response.json(
        { error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { storeName, amount, date, category, imageUrl, notes, currency } =
      validated.data;

    const receipt = await prisma.receipt.create({
      data: {
        storeName,
        amount,
        date: new Date(date),
        category,
        imageUrl: imageUrl || null,
        notes: notes || null,
        currency,
      },
    });

    revalidatePath("/");
    return Response.json({ receipt }, { status: 201 });
  } catch (error) {
    console.error("POST receipt error:", error);
    return Response.json({ error: "Failed to create receipt" }, { status: 500 });
  }
}
