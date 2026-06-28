import {
  createEmptyAdminTranslationEntry,
  type AdminTranslationEntry,
} from "@/app/admin/_components/translations/admin-translations-shared";
import { createSeedTranslationEntries } from "@/lib/app-translations";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";
import { buildTranslationDictionaryMap } from "@/lib/translation-dictionary";

function deserializeTranslationEntry(record: Record<string, unknown>): AdminTranslationEntry {
  const fallback = createEmptyAdminTranslationEntry();

  return {
    id: typeof record.id === "string" ? record.id : fallback.id,
    key: typeof record.key === "string" ? record.key : "",
    ko: typeof record.ko === "string" ? record.ko : "",
    en: typeof record.en === "string" ? record.en : "",
    createdAt: typeof record.created_at === "string" ? record.created_at : undefined,
    updatedAt: typeof record.updated_at === "string" ? record.updated_at : undefined,
  };
}

export function serializeTranslationEntry(entry: AdminTranslationEntry) {
  return {
    id: entry.id,
    key: entry.key.trim(),
    ko: entry.ko.trim(),
    en: entry.en.trim(),
    updated_at: new Date().toISOString(),
  };
}

function mergeTranslationEntries(entries: AdminTranslationEntry[]) {
  const seedEntries = createSeedTranslationEntries();
  const mergedByKey = new Map(seedEntries.map((entry) => [entry.key, entry] as const));

  entries.forEach((entry) => {
    const normalizedKey = entry.key.trim();

    if (!normalizedKey) {
      return;
    }

    const seedEntry = mergedByKey.get(normalizedKey);

    mergedByKey.set(normalizedKey, {
      id: entry.id,
      key: normalizedKey,
      ko: entry.ko.trim() || seedEntry?.ko || "",
      en: entry.en.trim() || seedEntry?.en || "",
      createdAt: entry.createdAt ?? seedEntry?.createdAt,
      updatedAt: entry.updatedAt ?? seedEntry?.updatedAt,
    });
  });

  return Array.from(mergedByKey.values()).sort((left, right) => left.key.localeCompare(right.key));
}

export async function fetchAdminTranslationEntries() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return createSeedTranslationEntries();
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/translation_dictionary?select=*&order=key.asc`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    next: {
      revalidate: 60,
      tags: ["translation-dictionary"],
    },
  });

  if (!response.ok) {
    return createSeedTranslationEntries();
  }

  const records = (await response.json()) as Array<Record<string, unknown>>;
  return mergeTranslationEntries(records.map(deserializeTranslationEntry));
}

export async function fetchAdminTranslationMap() {
  const entries = await fetchAdminTranslationEntries();
  return buildTranslationDictionaryMap(entries);
}
