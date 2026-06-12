import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — only created when first used, not at module evaluation time.
// This prevents build-time errors when env vars are not available during prerender.
let _client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
    );
  }

  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

export async function uploadReceiptImage(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `receipt-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `receipts/${fileName}`;

  const { error } = await supabase.storage
    .from("receipts")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data } = supabase.storage.from("receipts").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteReceiptImage(imageUrl: string): Promise<void> {
  const supabase = getSupabaseClient();
  const urlParts = imageUrl.split("/storage/v1/object/public/receipts/");
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];
  const { error } = await supabase.storage.from("receipts").remove([filePath]);
  if (error) {
    console.error("Failed to delete image:", error.message);
  }
}
