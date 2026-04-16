import type { Feature } from "@/types";

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const delays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
];

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const delay = delays[index % delays.length] ?? "animation-delay-100";

  return (
    <article
      className={`group rounded-2xl p-6 border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 cursor-pointer animate-fade-up opacity-0 ${delay}`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="mb-4 w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-300 text-base transition-all duration-300 group-hover:bg-brand-500/25 group-hover:border-brand-400/30">
        {feature.icon}
      </div>
      <h3 className="font-semibold text-white text-[15px] leading-snug mb-1.5">
        {feature.title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed">
        {feature.description}
      </p>
    </article>
  );
}
