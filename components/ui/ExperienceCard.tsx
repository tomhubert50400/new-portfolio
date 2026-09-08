import { useTranslations } from "next-intl";
import { Experience } from "@/lib/types";

type Props = { experience: Experience };

export function ExperienceCard({ experience }: Props) {
  const t = useTranslations();

  return (
    <div
      className="flex h-full flex-col rounded-card border border-card-border bg-card p-5 transition-colors"
      style={{ borderColor: experience.expandedDetailsKey ? experience.color + "40" : undefined }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {experience.companyKey ? t(experience.companyKey) : experience.company}
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: experience.color }}>{t(experience.roleKey)}</p>
        </div>
        <span className="text-xs text-text-muted">
          {experience.durationKey ? t(experience.durationKey) : experience.duration}
        </span>
      </div>
      <p className="mt-3 text-sm text-text-secondary">{t(experience.descriptionKey)}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {experience.tags.map((tag) => (
          <span key={tag} className="rounded-md px-2 py-0.5 text-xs text-text-secondary" style={{ backgroundColor: experience.color + "15" }}>{tag}</span>
        ))}
      </div>
      {experience.expandedDetailsKey && (
        <div>
          <p className="mt-4 border-t border-card-border pt-4 text-sm text-text-secondary">{t(experience.expandedDetailsKey)}</p>
          <p className="mt-2 text-xs text-text-muted">
            {experience.yearsKey ? t(experience.yearsKey) : experience.years}
          </p>
        </div>
      )}
    </div>
  );
}
