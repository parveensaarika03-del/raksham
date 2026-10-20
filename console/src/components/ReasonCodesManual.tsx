import { useState } from "react";
import { REASON_CODES_CATALOG, type ReasonCodeDoc } from "../data/reasonCodes";

export function ReasonCodesManual() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [lang, setLang] = useState<"EN" | "HI">("EN");

  const categories = ["ALL", "FLOOR", "VOICE", "DOCUMENT", "EMAIL", "ASK"];

  const filtered = REASON_CODES_CATALOG.filter((item) => {
    const matchesCat = activeCategory === "ALL" || item.category === activeCategory;
    const query = search.toLowerCase();
    const matchesSearch =
      item.code.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.explanationEn.toLowerCase().includes(query) ||
      item.explanationHi.includes(query);
    return matchesCat && matchesSearch;
  });

  const severityColor: Record<string, string> = {
    PASS: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    VERIFY: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    HOLD: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-sm">
              📖
            </span>
            Reason Codes & Threat Manual
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Understanding Satyapan verification signals, floor rules, and risk escalation triggers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-400">Language:</span>
          <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                lang === "EN"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("HI")}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                lang === "HI"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1.5 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of codes */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => (
          <div
            key={item.code}
            className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-black/20"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-indigo-300 tracking-tight">
                {item.code}
              </span>
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase ${severityColor[item.severity]}`}
              >
                {item.severity}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {lang === "EN" ? item.explanationEn : item.explanationHi}
            </p>

            <div className="rounded-lg border border-slate-800/60 bg-slate-900/80 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                Recommended Action:
              </span>
              <span className="text-xs font-medium text-slate-300">{item.action}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-8 text-center text-slate-500 text-sm">
          No reason codes found matching &ldquo;{search}&rdquo;.
        </div>
      )}
    </div>
  );
}

