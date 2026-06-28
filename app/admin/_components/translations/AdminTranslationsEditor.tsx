"use client";

import { Languages, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { AdminSaveDialog } from "@/app/admin/_components/save/AdminSaveDialog";
import { ADMIN_SAVE_REQUEST_EVENT } from "@/app/admin/_components/save/admin-save-events";
import {
  TRANSLATION_LOCALE_FIELDS,
  type AdminTranslationEntry,
} from "@/app/admin/_components/translations/admin-translations-shared";
import { isTranslationKeyUsed, TRANSLATION_EXPORT_COLUMNS } from "@/lib/app-translations";
import { buildTranslationCsv, parseTranslationCsv } from "@/lib/translation-csv";

type AdminTranslationsEditorProps = {
  initialEntries: AdminTranslationEntry[];
};

function normalizeEntry(entry: AdminTranslationEntry): AdminTranslationEntry {
  return {
    ...entry,
    key: entry.key.trim(),
    ko: entry.ko.trim(),
    en: entry.en.trim(),
  };
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

  return duplicateKeys;
}

function downloadFile(blob: Blob, fileName: string) {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(objectUrl);
}

export function AdminTranslationsEditor({ initialEntries }: AdminTranslationsEditorProps) {
  const entriesPerPage = 10;
  const [entries, setEntries] = useState<AdminTranslationEntry[]>(initialEntries);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");
  const [saveResultVariant, setSaveResultVariant] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const duplicateKeys = useMemo(() => getDuplicateKeys(entries), [entries]);
  const filteredEntries = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return entries;
    }

    return entries.filter((entry) =>
      [entry.key, entry.ko, entry.en].some((value) => value.toLowerCase().includes(normalizedKeyword)),
    );
  }, [entries, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / entriesPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedEntries = useMemo(() => {
    const startIndex = (activePage - 1) * entriesPerPage;
    return filteredEntries.slice(startIndex, startIndex + entriesPerPage);
  }, [activePage, filteredEntries]);

  const unusedEntries = useMemo(
    () => entries.filter((entry) => entry.key.trim().length > 0 && !isTranslationKeyUsed(entry.key)),
    [entries],
  );

  const translationCount = useMemo(
    () => entries.filter((entry) => entry.key.trim().length > 0).length,
    [entries],
  );

  function openSaveResult(message: string, variant: "success" | "error") {
    setSaveResultMessage(message);
    setSaveResultVariant(variant);
    setSaveResultOpen(true);
  }

  function updateEntry(entryId: string, field: keyof AdminTranslationEntry, value: string) {
    setEntries((currentEntries) =>
      currentEntries.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry)),
    );
  }

  function handleRemoveEntry(entryId: string) {
    setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== entryId));
  }

  function handleExportCsv() {
    const csv = buildTranslationCsv(entries.map(normalizeEntry));
    downloadFile(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
      "translation_dictionary.csv",
    );
  }

  function handleExportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      entries.map((entry) => ({
        key: entry.key,
        ko: entry.ko,
        en: entry.en,
      })),
      { header: TRANSLATION_EXPORT_COLUMNS },
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "translations");
    const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    downloadFile(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "translation_dictionary.xlsx",
    );
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      let nextEntries: AdminTranslationEntry[] = [];

      if (file.name.toLowerCase().endsWith(".csv")) {
        const content = await file.text();
        nextEntries = parseTranslationCsv(content);
      } else {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { defval: "" });
        nextEntries = rows.map((row, index) => ({
          id: `import-${index + 1}`,
          key: String(row.key ?? ""),
          ko: String(row.ko ?? ""),
          en: String(row.en ?? ""),
        }));
      }

      setEntries(nextEntries.map(normalizeEntry).filter((entry) => entry.key.length > 0));
      setCurrentPage(1);
      openSaveResult("번역 사전을 불러왔습니다.", "success");
    } catch {
      openSaveResult("파일 불러오기에 실패했습니다.", "error");
    } finally {
      event.target.value = "";
    }
  }

  function handleSaveConfirm() {
    const normalizedEntries = entries.map(normalizeEntry);

    if (duplicateKeys.size > 0) {
      openSaveResult(`중복 Key가 있습니다: ${Array.from(duplicateKeys).join(", ")}`, "error");
      setSaveConfirmOpen(false);
      return;
    }

    setSaveConfirmOpen(false);

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/admin/translations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ entries: normalizedEntries }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as
            | { error?: string; duplicateKeys?: string[] }
            | null;

          openSaveResult(
            payload?.duplicateKeys?.length
              ? `중복 Key가 있습니다: ${payload.duplicateKeys.join(", ")}`
              : "저장에 실패했습니다.",
            "error",
          );
          return;
        }

        setEntries(normalizedEntries);
        openSaveResult("저장이 완료되었습니다.", "success");
      })();
    });
  }

  useEffect(() => {
    const handleSaveRequest = () => {
      setSaveConfirmOpen(true);
    };

    window.addEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);

    return () => {
      window.removeEventListener(ADMIN_SAVE_REQUEST_EVENT, handleSaveRequest);
    };
  }, []);

  return (
    <div className="space-y-5">
      <AdminSaveDialog
        confirmOpen={saveConfirmOpen}
        isPending={isPending}
        resultMessage={saveResultMessage}
        resultOpen={saveResultOpen}
        resultVariant={saveResultVariant}
        onCancelConfirm={() => setSaveConfirmOpen(false)}
        onCloseResult={() => setSaveResultOpen(false)}
        onConfirm={handleSaveConfirm}
      />

      <section className="rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-[#8B6F47]" />
            <h2 className="text-sm font-extrabold text-gray-900">번역 사전 현황</h2>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-[#ece7de] bg-[#faf8f4] px-4 py-3">
            <div className="text-[11px] font-bold text-[#8B6F47]">총 번역 수</div>
            <div className="mt-1 text-[20px] font-extrabold text-[#2f2418]">{translationCount}</div>
          </div>
          <div className="rounded-2xl border border-[#ece7de] bg-[#faf8f4] px-4 py-3">
            <div className="text-[11px] font-bold text-[#8B6F47]">사용 중 Key</div>
            <div className="mt-1 text-[20px] font-extrabold text-[#2f2418]">
              {translationCount - unusedEntries.length}
            </div>
          </div>
          <div className="rounded-2xl border border-[#ece7de] bg-[#faf8f4] px-4 py-3">
            <div className="text-[11px] font-bold text-[#8B6F47]">미사용 Key</div>
            <div className="mt-1 text-[20px] font-extrabold text-[#2f2418]">{unusedEntries.length}</div>
          </div>
          <div className="rounded-2xl border border-[#ece7de] bg-[#faf8f4] px-4 py-3">
            <div className="text-[11px] font-bold text-[#8B6F47]">중복 Key</div>
            <div className="mt-1 text-[20px] font-extrabold text-[#2f2418]">{duplicateKeys.size}</div>
          </div>
        </div>

        {unusedEntries.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-[#ece7de] bg-[#faf8f4] p-4">
            <div className="text-[12px] font-bold text-[#2f2418]">미사용 Key</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {unusedEntries.map((entry) => (
                <span
                  key={entry.id}
                  className="rounded-full border border-[#e6ddd0] bg-white px-3 py-1 text-[11px] font-medium text-[#69758a]"
                >
                  {entry.key}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleImportFile}
        />

        <div className="border-b border-gray-100 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-[#8B6F47]" />
              <h3 className="text-sm font-extrabold text-gray-900">번역 사전 관리</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-[#ece7de] bg-[#faf8f4] px-4 py-2 text-[11px] font-bold text-[#69758a] transition-all hover:border-[#d9c9ae] hover:text-[#2f2418]"
              >
                가져오기
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="rounded-full border border-[#ece7de] bg-[#faf8f4] px-4 py-2 text-[11px] font-bold text-[#69758a] transition-all hover:border-[#d9c9ae] hover:text-[#2f2418]"
              >
                CSV 내보내기
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="rounded-full border border-[#ece7de] bg-[#faf8f4] px-4 py-2 text-[11px] font-bold text-[#69758a] transition-all hover:border-[#d9c9ae] hover:text-[#2f2418]"
              >
                Excel 내보내기
              </button>
            </div>
          </div>

          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa4b2]" />
            <input
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
              placeholder="Key, 한국어, 영어로 검색"
            />
          </label>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-[#faf8f4] px-5 py-12 text-center">
            <p className="text-sm font-bold text-gray-700">검색 결과가 없습니다.</p>
            <p className="mt-2 text-xs text-gray-500">검색어를 변경해 다시 확인해 주세요.</p>
          </div>
        ) : (
          <>
            <div className="mt-4 overflow-hidden rounded-[22px] border border-[#ece7de]">
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border-collapse">
                  <thead className="bg-[#faf8f4]">
                    <tr className="border-b border-[#ece7de] text-left">
                      <th className="w-14 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
                        No
                      </th>
                      <th className="w-24 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
                        상태
                      </th>
                      <th className="w-[31%] px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
                        Key
                      </th>
                      <th className="w-[25%] px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
                        KO
                      </th>
                      <th className="w-[25%] px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
                        EN
                      </th>
                      <th className="w-16 px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
                        삭제
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {paginatedEntries.map((entry, index) => {
                      const normalizedKey = entry.key.trim();
                      const isDuplicate = normalizedKey.length > 0 && duplicateKeys.has(normalizedKey);
                      const isUnused = normalizedKey.length > 0 && !isTranslationKeyUsed(normalizedKey);

                      return (
                        <tr
                          key={entry.id}
                          className="border-b border-[#f1ece4] align-top last:border-b-0"
                        >
                          <td className="px-3 py-2.5 text-[11px] font-bold text-[#8B6F47]">
                            {String((activePage - 1) * entriesPerPage + index + 1).padStart(2, "0")}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {isDuplicate ? (
                                <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
                                  Duplicate
                                </span>
                              ) : null}
                              {isUnused ? (
                                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-500">
                                  Unused
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              value={entry.key}
                              onChange={(event) => updateEntry(entry.id, "key", event.target.value)}
                              className={[
                                "w-full rounded-xl border bg-gray-50 px-3 py-2 text-[11px] text-gray-800 outline-none transition-colors focus:bg-white focus:outline-none",
                                isDuplicate
                                  ? "border-red-200 focus:border-red-500"
                                  : "border-gray-100 focus:border-[#8B6F47]",
                              ].join(" ")}
                              placeholder="reserve_button"
                            />
                          </td>
                          {TRANSLATION_LOCALE_FIELDS.map((localeField) => (
                            <td key={localeField} className="px-3 py-2">
                              <textarea
                                rows={2}
                                value={entry[localeField]}
                                onChange={(event) => updateEntry(entry.id, localeField, event.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-800 outline-none transition-colors focus:border-[#8B6F47] focus:bg-white focus:outline-none"
                                placeholder={localeField === "ko" ? "예약하기" : "Book Now"}
                              />
                            </td>
                          ))}
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveEntry(entry.id)}
                              className="inline-flex rounded-lg border border-[#ece7de] bg-white p-1.5 text-red-500 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                              title="삭제"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-gray-500">
                {filteredEntries.length}개 중 {(activePage - 1) * entriesPerPage + 1}-
                {Math.min(activePage * entriesPerPage, filteredEntries.length)} 표시
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={activePage === 1}
                  className="inline-flex h-8 items-center rounded-full border border-[#ece7de] bg-white px-3 text-[11px] font-bold text-[#69758a] transition-all hover:border-[#d9c9ae] hover:text-[#2f2418] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  이전
                </button>
                <span className="min-w-16 text-center text-[11px] font-bold text-[#2f2418]">
                  {activePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={activePage === totalPages}
                  className="inline-flex h-8 items-center rounded-full border border-[#ece7de] bg-white px-3 text-[11px] font-bold text-[#69758a] transition-all hover:border-[#d9c9ae] hover:text-[#2f2418] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
