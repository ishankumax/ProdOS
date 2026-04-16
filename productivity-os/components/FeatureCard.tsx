import type { Feature } from "@/types";

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const delays = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
  ];
  const delay = delays[index % delays.length] ?? "animation-delay-100";

  return (
    <article
      className={`card-hover group animate-fade-up opacity-0 ${delay}`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-300 text-lg transition-all duration-300 group-hover:bg-brand-500/25 group-hover:border-brand-400/40 group-hover:scale-110">
          {feature.icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-white text-[15px] leading-snug">
            {feature.title}
          </h3>
          <p className="text-subtle text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </article>
  );
}
