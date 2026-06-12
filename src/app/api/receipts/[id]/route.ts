import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const receipt = await prisma.receipt.findUnique({ where: { id } });
    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    await prisma.receipt.delete({ where: { id } });

    revalidatePath("/");
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE receipt error:", error);
    return Response.json({ error: "Failed to delete receipt" }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const receipt = await prisma.receipt.findUnique({ where: { id } });
    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    return Response.json({ receipt });
  } catch (error) {
    console.error("GET receipt error:", error);
    return Response.json({ error: "Failed to fetch receipt" }, { status: 500 });
  }
}
