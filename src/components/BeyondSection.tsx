import { portfolioData } from "@/data/portfolio";

export function BeyondSection() {
  const { beyondBusiness } = portfolioData;

  return (
    <section
      id="beyond"
      className="flex min-h-dvh flex-col justify-center border-t border-cream/10 px-6 py-24 sm:px-10 sm:py-32 md:px-14"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Quiet Left Margin Label */}
          <div className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">
              {beyondBusiness.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(3.2rem,6.5vw,5.75rem)] font-normal uppercase leading-[0.94] tracking-[0.015em] text-[#EDE9E0]">
              {beyondBusiness.heading}
            </h2>
          </div>

          {/* Story Column */}
          <div className="max-w-2xl lg:col-span-8 lg:pt-8">
            <p className="font-sans text-xl leading-[1.6] font-normal text-[#EDE9E0] sm:text-2xl">
              {beyondBusiness.lead}
            </p>

            <div className="mt-12 divide-y divide-cream/10 border-t border-cream/10">
              {beyondBusiness.notes.map((note) => (
                <div
                  key={note.label}
                  className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-6"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-cream/85 sm:col-span-3 sm:pt-1">
                    {note.label}
                  </p>
                  <p className="font-sans text-sm leading-[1.7] text-cream-muted sm:col-span-9 sm:text-base">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-cream/85">
              {beyondBusiness.closingLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
