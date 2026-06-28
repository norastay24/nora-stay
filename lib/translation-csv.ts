import type { AdminTranslationEntry } from "@/app/admin/_components/translations/admin-translations-shared";
import { TRANSLATION_EXPORT_COLUMNS } from "@/lib/app-translations";

function escapeCsvCell(value: string) {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, "\"\"")}"`;
  }

  return normalized;
}

export function buildTranslationCsv(entries: AdminTranslationEntry[]) {
  const rows = [
    TRANSLATION_EXPORT_COLUMNS.join(","),
    ...entries.map((entry) =>
      TRANSLATION_EXPORT_COLUMNS.map((column) => escapeCsvCell(entry[column] ?? "")).join(","),
    ),
  ];

  return rows.join("\n");
}

export function parseTranslationCsv(content: string) {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const nextChar = content[index + 1];

    if (insideQuotes) {
      if (char === `"` && nextChar === `"`) {
        currentCell += `"`;
        index += 1;
      } else if (char === `"`) {
        insideQuotes = false;
      } else {
        currentCell += char;
      }

      continue;
    }

    if (char === `"`) {
      insideQuotes = true;
      continue;
    }

    if (char === ",") {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (char === "\n") {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentCell = "";
      currentRow = [];
      continue;
    }

    if (char !== "\r") {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  if (rows.length === 0) {
    return [];
  }

  const [header, ...dataRows] = rows;
  const columnIndexes = Object.fromEntries(header.map((column, index) => [column.trim(), index]));

  return dataRows
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .map((row, index) => ({
      id: `import-${index + 1}`,
      key: row[columnIndexes.key] ?? "",
      ko: row[columnIndexes.ko] ?? "",
      en: row[columnIndexes.en] ?? "",
    }));
}
