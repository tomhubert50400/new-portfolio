import { ScrollReveal } from "./ScrollReveal";

type Props = { title: string; subtitle?: string; centered?: boolean };

export function SectionHeader({ title, subtitle, centered = false }: Props) {
  return (
    <ScrollReveal className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="text-3xl font-bold text-text-primary md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-text-muted">{subtitle}</p>}
    </ScrollReveal>
  );
}
