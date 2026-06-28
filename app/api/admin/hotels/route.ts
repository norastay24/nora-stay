import { NextResponse } from "next/server";
import type { AdminHotelBranch } from "@/app/admin/_components/hotels/admin-hotels-shared";
import { getAdminSession } from "@/lib/auth/admin-session";
import { serializeHotelBranch } from "@/lib/server/admin-hotel-branches";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";

type SerializedHotelBranch = ReturnType<typeof serializeHotelBranch>;
const OPTIONAL_LEGACY_COLUMNS = new Set([
  "preview_link",
  "latitude",
  "longitude",
  "address_en",
  "description_en",
  "amenity_notes_en",
]);

function validateBranch(branch: AdminHotelBranch) {
  if (!branch.id || !branch.slug || !branch.name || !branch.address) {
    return false;
  }

  return true;
}

async function saveBranchRecord(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload:
    | SerializedHotelBranch
    | Omit<SerializedHotelBranch, "preview_link" | "latitude" | "longitude">,
) {
  return fetch(`${supabaseUrl}/rest/v1/admin_hotel_branches?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(payload),
  });
}

function shouldRetryWithoutLegacyColumns(errorText: string) {
  return [...OPTIONAL_LEGACY_COLUMNS].some(
    (column) =>
      errorText.includes(column) &&
      (errorText.includes("schema cache") || errorText.includes("Could not find the")),
  );
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
    const { branch, branches } = (await request.json()) as {
      branch?: AdminHotelBranch;
      branches?: AdminHotelBranch[];
    };

    const branchList = Array.isArray(branches) ? branches : branch ? [branch] : [];

    if (branchList.length === 0 || branchList.some((item) => !validateBranch(item))) {
      return NextResponse.json({ error: "Invalid branch payload." }, { status: 400 });
    }

    for (const currentBranch of branchList) {
      const payload = serializeHotelBranch(currentBranch);
      let response = await saveBranchRecord(supabaseUrl, serviceRoleKey, payload);

      if (!response.ok) {
        const errorText = await response.text();

        if (shouldRetryWithoutLegacyColumns(errorText)) {
          const legacyPayload = Object.fromEntries(
            Object.entries(payload).filter(([key]) => !OPTIONAL_LEGACY_COLUMNS.has(key)),
          ) as Omit<SerializedHotelBranch, "preview_link" | "latitude" | "longitude">;

          response = await saveBranchRecord(supabaseUrl, serviceRoleKey, legacyPayload);
        } else {
          return NextResponse.json(
            { error: "Failed to save branch.", detail: errorText },
            { status: 500 },
          );
        }
      }

      if (!response.ok) {
        const errorText = await response.text();

        return NextResponse.json(
          { error: "Failed to save branch.", detail: errorText },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Branch id is required." }, { status: 400 });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/admin_hotel_branches?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    return NextResponse.json(
      { error: "Failed to delete branch.", detail: errorText },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
