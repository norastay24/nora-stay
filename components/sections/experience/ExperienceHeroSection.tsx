type ExperienceHeroSectionProps = {
  title: string;
  description: string;
};

export function ExperienceHeroSection({
  title,
  description,
}: ExperienceHeroSectionProps) {
  return (
    <section className="bg-[#f8f5ef] px-8 py-24 text-center">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center">
        <p className="text-[14px] font-bold uppercase tracking-[0.28em] text-[#8c6239]">
          THE NORA EXPERIENCE
        </p>

        <h1 className="mt-8 whitespace-pre-line text-[48px] font-extrabold leading-[1.14] tracking-[-0.02em] text-[#152033]">
          {title}
        </h1>

        <p className="mt-10 max-w-[820px] whitespace-pre-line text-[16px] tracking-[-0.03em] text-[#5f6f84]">
          {description}
        </p>
      </div>
    </section>
  );
}
