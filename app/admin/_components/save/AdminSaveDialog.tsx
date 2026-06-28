"use client";

type AdminSaveDialogProps = {
  confirmOpen: boolean;
  confirmMessage?: string;
  isPending: boolean;
  resultMessage: string;
  resultOpen: boolean;
  resultVariant?: "success" | "error";
  onCancelConfirm: () => void;
  onCloseResult: () => void;
  onConfirm: () => void;
};

export function AdminSaveDialog({
  confirmOpen,
  confirmMessage = "변경 사항을 저장하시겠습니까?",
  isPending,
  resultMessage,
  resultOpen,
  resultVariant = "success",
  onCancelConfirm,
  onCloseResult,
  onConfirm,
}: AdminSaveDialogProps) {
  return (
    <>
      {confirmOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2f2418]/28 px-4">
          <div className="w-full max-w-sm rounded-[18px] border border-[#eadfce] bg-white px-6 py-6 text-center shadow-[0_24px_80px_rgba(79,58,31,0.18)]">
            <p className="text-[19px] font-extrabold tracking-[-0.03em] text-[#2f2418]">
              {confirmMessage}
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onCancelConfirm}
                disabled={isPending}
                className="inline-flex min-w-24 items-center justify-center rounded-full border border-[#e6dccd] px-4 py-2 text-sm font-bold text-[#7b6a55] transition-colors hover:bg-[#f7f2ea] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className="inline-flex min-w-24 items-center justify-center rounded-full bg-[#8b6f47] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#745a37] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isPending ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {resultOpen ? (
        <button
          type="button"
          onClick={onCloseResult}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2f2418]/18 px-4"
        >
          <span
            className={[
              "block w-full max-w-xs rounded-[28px] border bg-white px-6 py-6 text-center shadow-[0_24px_80px_rgba(79,58,31,0.18)]",
              resultVariant === "error" ? "border-[#f0d0cd]" : "border-[#eadfce]",
            ].join(" ")}
          >
            <span
              className={[
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-black",
                resultVariant === "error"
                  ? "bg-[#fff1ef] text-[#c45b4b]"
                  : "bg-[#f6efe6] text-[#8b6f47]",
              ].join(" ")}
            >
              {resultVariant === "error" ? "!" : "✓"}
            </span>
            <span className="mt-4 block text-[17px] font-extrabold tracking-[-0.03em] text-[#2f2418]">
              {resultMessage}
            </span>
          </span>
        </button>
      ) : null}
    </>
  );
}
