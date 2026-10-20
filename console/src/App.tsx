// Payment Verification Desk — top-level layout (T06).
import { useState } from "react";
import { DEMO_USERS } from "./api";
import type { DemoUser } from "./types";
import { CaseList } from "./components/CaseList";
import { CaseView } from "./components/CaseView";
import { OobInbox } from "./components/OobInbox";
import { RoleSwitcher } from "./components/RoleSwitcher";
import { ReasonCodesManual } from "./components/ReasonCodesManual";
import { MediaAnalyzer } from "./components/MediaAnalyzer";

type NavigationTab = "cases" | "media-scan" | "manual";

export default function App() {
  const [user, setUser] = useState<DemoUser>(DEMO_USERS[0].user);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<NavigationTab>("cases");

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/90 px-6 py-3 backdrop-blur-md shadow-lg shadow-black/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 shadow-md shadow-indigo-500/25">
              <span className="text-lg font-black text-white">स</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Satyapan
                </h1>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  Desk
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Payment Verification &middot; <span className="text-slate-500">Raise-only band</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/70 p-1">
            <button
              type="button"
              onClick={() => setCurrentTab("cases")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                currentTab === "cases"
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>📋</span> Verification Desk
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab("media-scan")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                currentTab === "media-scan"
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>🎙️</span> Audio/Video Scan
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab("manual")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                currentTab === "manual"
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>📖</span> Reason Codes Manual
            </button>
          </nav>
        </div>

        <RoleSwitcher user={user} onChange={setUser} />
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 flex-1 flex flex-col">
        {currentTab === "cases" && (
          <div className="grid flex-1 gap-6 md:grid-cols-[minmax(20rem,25rem)_minmax(0,1fr)]">
            <section className="flex flex-col min-h-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                  Verification Cases
                </h2>
              </div>
              <div className="flex-1 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-xl shadow-black/30 backdrop-blur-sm">
                <CaseList user={user} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </section>

            <section className="flex flex-col min-h-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                  Case Intelligence
                </h2>
              </div>
              <div className="space-y-4">
                <OobInbox user={user} />
                <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-xl shadow-black/30 backdrop-blur-sm">
                  <CaseView user={user} caseId={selectedId} />
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === "media-scan" && (
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-xl shadow-black/30 backdrop-blur-sm">
            <MediaAnalyzer user={user} />
          </div>
        )}

        {currentTab === "manual" && (
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-xl shadow-black/30 backdrop-blur-sm">
            <ReasonCodesManual />
          </div>
        )}
      </main>
    </div>
  );
}
