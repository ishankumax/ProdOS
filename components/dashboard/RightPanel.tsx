const DOMAINS = [
  { title: "InTheBox", note: "Product strategy & design" },
  { title: "Read Nova Story", note: "Drafting the opening chapter" },
  { title: "Personal Study", note: "Advanced Typescript & Rust" },
];

export default function RightPanel() {
  return (
    <aside className="w-full h-full p-6 space-y-8 bg-surface border-l border-white/5 sticky top-0">
      <div>
        <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">
          Domains
        </h3>
        <div className="space-y-3">
          {DOMAINS.map((domain) => (
            <div
              key={domain.title}
              className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-default"
            >
              <h4 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                {domain.title}
              </h4>
              <p className="text-[10px] text-white/30 mt-1 line-clamp-2">
                {domain.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-tight"> Pro Tip </p>
          <p className="text-xs text-brand-300/70 mt-2 leading-relaxed">
            Consolidate your domains into 3 distinct areas to minimize context switching.
          </p>
        </div>
      </div>
    </aside>
  );
}
