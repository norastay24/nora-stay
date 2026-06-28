import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { AdminExperienceContent } from "@/app/admin/_components/experience/admin-experience-shared";
import { getAdminSession } from "@/lib/auth/admin-session";
import {
  serializeExperienceCategory,
  serializeExperienceItem,
  serializeExperienceSettings,
} from "@/lib/server/admin-experience-content";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

function isValidPayload(payload: AdminExperienceContent | undefined): payload is AdminExperienceContent {
  return Boolean(payload && Array.isArray(payload.categories) && Array.isArray(payload.items));
}

async function upsertRecords(
  supabaseUrl: string,
  serviceRoleKey: string,
  table: string,
  records: unknown[],
) {
  return fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(records),
  });
}

async function deleteMissingRecords(
  supabaseUrl: string,
  serviceRoleKey: string,
  table: string,
  ids: string[],
) {
  const filter =
    ids.length > 0
      ? `id=not.in.(${ids.map((id) => `"${id}"`).join(",")})`
      : "";
  const url = filter
    ? `${supabaseUrl}/rest/v1/${table}?${filter}`
    : `${supabaseUrl}/rest/v1/${table}`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
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
    const { content } = (await request.json()) as { content?: AdminExperienceContent };

    if (!isValidPayload(content)) {
      return NextResponse.json({ error: "Invalid experience payload." }, { status: 400 });
    }

    const settingsPayload = serializeExperienceSettings(content.settings);
    const categoriesPayload = content.categories.map(serializeExperienceCategory);
    const itemsPayload = content.items.map(serializeExperienceItem);

    const settingsResponse = await fetch(
      `${supabaseUrl}/rest/v1/admin_experience_page_settings?on_conflict=id`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(settingsPayload),
      },
    );

    if (!settingsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save experience settings.", detail: await settingsResponse.text() },
        { status: 500 },
      );
    }

    const categoriesResponse = await upsertRecords(
      supabaseUrl,
      serviceRoleKey,
      "admin_experience_categories",
      categoriesPayload,
    );

    if (!categoriesResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save experience categories.", detail: await categoriesResponse.text() },
        { status: 500 },
      );
    }

    const itemsResponse = await upsertRecords(
      supabaseUrl,
      serviceRoleKey,
      "admin_experience_items",
      itemsPayload,
    );

    if (!itemsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save experience items.", detail: await itemsResponse.text() },
        { status: 500 },
      );
    }

    await deleteMissingRecords(
      supabaseUrl,
      serviceRoleKey,
      "admin_experience_items",
      content.items.map((item) => item.id),
    );
    await deleteMissingRecords(
      supabaseUrl,
      serviceRoleKey,
      "admin_experience_categories",
      content.categories.map((category) => category.id),
    );

    revalidateTag("admin-experience-content", "max");
    revalidatePath("/admin/experience");
    revalidatePath("/experience");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
