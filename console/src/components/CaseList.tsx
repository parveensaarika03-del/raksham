// T06: left pane — the case queue for the signed-in demo user.
import { useEffect, useState } from "react";
import { api } from "../api";
import type { CaseSummary, DemoUser } from "../types";
import { BandBadge } from "./BandBadge";

interface CaseListProps {
  user: DemoUser;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function money(inr: number | null): string {
  return inr === null ? "—" : `₹${inr.toLocaleString("en-IN")}`;
}

export function CaseList({ user, selectedId, onSelect }: CaseListProps) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .listCases(user)
      .then((rows) => {
        if (alive) setCases(rows);
      })
      .catch((e: unknown) => {
        if (alive) setError(String(e));
      });
    return () => {
      alive = false;
    };
  }, [user]);

  if (error) return <p className="p-4 text-sm text-red-700">Could not load cases: {error}</p>;
  if (cases.length === 0)
    return <p className="p-4 text-sm text-slate-500">No cases for this user.</p>;

  return (
    <ul className="divide-y divide-slate-800/60 overflow-y-auto max-h-[calc(100vh-14rem)] bg-transparent">
      {cases.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            data-testid="case-row"
            onClick={() => onSelect(c.id)}
            aria-current={selectedId === c.id ? "true" : undefined}
            className={`group flex w-full flex-col gap-1.5 p-3.5 text-left transition-all duration-150 hover:bg-slate-800/40 cursor-pointer ${
              selectedId === c.id
                ? "bg-indigo-600/15 border-l-4 border-indigo-500 shadow-inner"
                : "border-l-4 border-transparent"
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              <BandBadge band={c.band} />
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                {money(c.amount_inr)}
              </span>
            </span>
            <span className="text-sm font-medium text-slate-200 line-clamp-1">{c.title}</span>
            <span className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="font-mono text-[10px] text-slate-500">{c.id}</span>
              <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700/60 uppercase tracking-wider">{c.status}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default CaseList;
