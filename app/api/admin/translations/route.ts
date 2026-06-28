import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { AdminTranslationEntry } from "@/app/admin/_components/translations/admin-translations-shared";
import { getAdminSession } from "@/lib/auth/admin-session";
import { serializeTranslationEntry } from "@/lib/server/admin-translations";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function validateTranslationEntry(entry: AdminTranslationEntry) {
  return (
    typeof entry.id === "string" &&
    typeof entry.key === "string" &&
    typeof entry.ko === "string" &&
    typeof entry.en === "string"
  );
}

function getDuplicateKeys(entries: AdminTranslationEntry[]) {
  const seenKeys = new Set<string>();
  const duplicateKeys = new Set<string>();

  entries.forEach((entry) => {
    const normalizedKey = entry.key.trim();

    if (!normalizedKey) {
      return;
    }

    if (seenKeys.has(normalizedKey)) {
      duplicateKeys.add(normalizedKey);
      return;
    }

    seenKeys.add(normalizedKey);
  });

  return Array.from(duplicateKeys);
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  try {
    const { entries } = (await request.json()) as { entries?: AdminTranslationEntry[] };

    if (!Array.isArray(entries) || entries.some((entry) => !validateTranslationEntry(entry))) {
      return NextResponse.json({ error: "Invalid translation entries payload." }, { status: 400 });
    }

    const duplicateKeys = getDuplicateKeys(entries);

    if (duplicateKeys.length > 0) {
      return NextResponse.json(
        { error: "Duplicate translation keys.", duplicateKeys },
        { status: 400 },
      );
    }

    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/translation_dictionary?id=neq.__none__`, {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      return NextResponse.json(
        { error: "Failed to reset translation dictionary.", detail: errorText },
        { status: 500 },
      );
    }

    const payload = entries
      .map((entry) => ({
        ...entry,
        key: entry.key.trim(),
        ko: entry.ko.trim(),
        en: entry.en.trim(),
      }))
      .filter((entry) => entry.key.length > 0)
      .map(serializeTranslationEntry);

    if (payload.length > 0) {
      const response = await fetch(`${supabaseUrl}/rest/v1/translation_dictionary`, {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "Failed to save translation dictionary.", detail: errorText },
          { status: 500 },
        );
      }
    }

    revalidateTag("translation-dictionary", "max");
    revalidatePath("/");
    revalidatePath("/branches");
    revalidatePath("/experience");
    revalidatePath("/locations/[slug]", "page");
    revalidatePath("/admin/translations");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
