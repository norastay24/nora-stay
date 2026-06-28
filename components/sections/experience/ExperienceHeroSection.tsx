type ExperienceHeroSectionProps = {
  title: string;
  description: string;
};

export function ExperienceHeroSection({
  title,
  description,
}: ExperienceHeroSectionProps) {
  return (
    <section className="bg-[#f8f5ef] px-8 py-24 text-center max-[1024px]:py-20 max-[640px]:px-5 max-[640px]:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center">
        <p className="text-[14px] font-bold uppercase tracking-[0.28em] text-[#8c6239] max-[640px]:text-[12px] max-[640px]:tracking-[0.2em]">
          THE NORA EXPERIENCE
        </p>

        <h1 className="mt-8 whitespace-pre-line text-[48px] font-extrabold leading-[1.14] tracking-[-0.02em] text-[#152033] max-[1024px]:text-[42px] max-[640px]:mt-6 max-[640px]:text-[30px] max-[640px]:leading-[1.2]">
          {title}
        </h1>

        <p className="mt-10 max-w-[820px] whitespace-pre-line text-[16px] tracking-[-0.03em] text-[#5f6f84] max-[640px]:mt-7 max-[640px]:text-[14px] max-[640px]:leading-[1.7]">
          {description}
        </p>
      </div>
    </section>
  );
}
