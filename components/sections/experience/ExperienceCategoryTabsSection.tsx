"use client";

type ExperienceCategoryTabsSectionProps = {
  activeCategoryId: string;
  categories: Array<{
    id: string;
    label: string;
  }>;
  onSelectCategory: (categoryId: string) => void;
};

export function ExperienceCategoryTabsSection({
  activeCategoryId,
  categories,
  onSelectCategory,
}: ExperienceCategoryTabsSectionProps) {
  return (
    <section className="sticky top-20 z-40 border-y border-[#f0ebe3] bg-[#f8f5ef]/90 px-8 py-5 backdrop-blur-md max-[640px]:px-4 max-[640px]:py-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-4 overflow-x-auto max-[640px]:justify-start max-[640px]:gap-2.5 max-[640px]:pb-1">
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={[
                "inline-flex h-[34px] shrink-0 items-center justify-center rounded-full border px-5 text-[12px] font-bold tracking-[-0.03em] transition-colors max-[640px]:h-[32px] max-[640px]:px-4 max-[640px]:text-[11px]",
                isActive
                  ? "border-[#9c7b4b] bg-[#9c7b4b] text-white"
                  : "border-[#ece7dd] bg-[#fcfbf8] text-[#5d6777]",
              ].join(" ")}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
