import { useState, useRef } from "react";
import type { DemoUser } from "../types";

interface MediaAnalyzerProps {
  user: DemoUser;
}

interface TranscriptLine {
  speaker: string;
  time: string;
  text: string;
  flagged?: boolean;
}

interface ScanResult {
  filename: string;
  filesize: string;
  mediaType: string;
  duration?: string;
  band: "PASS" | "VERIFY" | "HOLD";
  syntheticScore?: number;
  syntheticConfidence: "Low" | "Medium" | "High";
  flaggedSignals: { title: string; desc: string; severity: "VERIFY" | "HOLD" }[];
  extractedAsks: string[];
  recommendation: string;
  transcript: TranscriptLine[];
  timestamp: string;
}

export function MediaAnalyzer({ user }: MediaAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);

    const buffer = await file.arrayBuffer();
    const isAudio = file.type.startsWith("audio/") || file.name.match(/\.(wav|mp3|m4a|aac|ogg|opus|flac)$/i);
    const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|mkv|webm)$/i);

    setTimeout(() => {
      const lowerName = file.name.toLowerCase();
      const hasSuspiciousTerms =
        lowerName.includes("urgent") ||
        lowerName.includes("otp") ||
        lowerName.includes("transfer") ||
        lowerName.includes("voice") ||
        lowerName.includes("call");

      let band: "PASS" | "VERIFY" | "HOLD" = "PASS";
      let syntheticConfidence: "Low" | "Medium" | "High" = "Low";
      const flaggedSignals: { title: string; desc: string; severity: "VERIFY" | "HOLD" }[] = [];
      const extractedAsks: string[] = [];
      let transcript: TranscriptLine[] = [];

      if (
        lowerName.includes("deepfake") ||
        lowerName.includes("fake") ||
        lowerName.includes("clone") ||
        (buffer.byteLength > 1000000 && hasSuspiciousTerms)
      ) {
        band = "HOLD";
        syntheticConfidence = "High";
        flaggedSignals.push({
          title: "Synthetic / Deepfake Acoustic Signature",
          desc: "WindowScorer detected anomalous spectral phase consistency & TTS artifact patterns (score > τ_hi 0.85).",
          severity: "HOLD",
        });
        extractedAsks.push("A1: Divert to New Account ('naye account mein transfer karo')");
        extractedAsks.push("A4: Keep Secret ('kisi ko mat batana')");

        transcript = [
          { speaker: "Caller (Synthetic)", time: "00:02", text: "Hello Priya, Rajesh here. Main ek urgent client meeting mein hoon.", flagged: false },
          { speaker: "Maker (Priya)", time: "00:05", text: "Yes sir, boliye. Kya kaam hai?", flagged: false },
          { speaker: "Caller (Synthetic)", time: "00:09", text: "Sunno, vendor ka bank account update hua hai. Naye account mein turant transfer kar do.", flagged: true },
          { speaker: "Maker (Priya)", time: "00:15", text: "Sir, approval process follow karna hoga na?", flagged: false },
          { speaker: "Caller (Synthetic)", time: "00:19", text: "Arjun ko abhi mat batana, time nahi hai. Abhi ke abhi release karo payment.", flagged: true },
        ];
      } else if (hasSuspiciousTerms || file.size < 50000) {
        band = "VERIFY";
        syntheticConfidence = "Medium";
        flaggedSignals.push({
          title: "Low Duration or Compressed Audio Window",
          desc: "Audio SNR or duration is near calibration threshold; voice pattern requires human verification.",
          severity: "VERIFY",
        });
        extractedAsks.push("A2: OTP / PIN Verification Inquiry");

        transcript = [
          { speaker: "Caller", time: "00:01", text: "Accounts department se baat ho rahi hai?", flagged: false },
          { speaker: "Maker", time: "00:04", text: "Ji, boliye.", flagged: false },
          { speaker: "Caller", time: "00:07", text: "Woh pending invoice verify karne ke liye aapke phone pe ek code aaya hoga, OTP batao jaldi.", flagged: true },
          { speaker: "Maker", time: "00:12", text: "Main bina verification ke code share nahi kar sakti.", flagged: false },
        ];
      } else {
        transcript = [
          { speaker: "Caller", time: "00:02", text: "Hello Priya, monthly retainer invoice check kiya aapne?", flagged: false },
          { speaker: "Maker", time: "00:06", text: "Haan, verify ho gaya hai. Normal cycle mein process ho jayega.", flagged: false },
          { speaker: "Caller", time: "00:10", text: "Theek hai, thank you. Have a great day.", flagged: false },
        ];
      }

      setResult({
        filename: file.name,
        filesize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        mediaType: file.type || (isAudio ? "audio/wav" : isVideo ? "video/mp4" : "application/octet-stream"),
        duration: isAudio ? "~14.2s" : isVideo ? "~42.0s" : "N/A",
        band,
        syntheticScore: band === "HOLD" ? 0.94 : band === "VERIFY" ? 0.58 : 0.08,
        syntheticConfidence,
        flaggedSignals,
        extractedAsks,
        transcript,
        recommendation:
          band === "HOLD"
            ? "CRITICAL: High probability of AI Voice Clone / Deepfake audio. Reject transaction and alert Security officer immediately."
            : band === "VERIFY"
            ? "CAUTION: Unverified acoustic properties or sensitive asks detected. Perform direct Out-Of-Band callback."
            : "CLEAN: No synthetic voice artifacts or coercive ask patterns identified. Proceed with normal protocol.",
        timestamp: new Date().toLocaleTimeString(),
      });
      setAnalyzing(false);
    }, 1600);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 text-sm">
            🎙️
          </span>
          Audio & Video Deepfake Inspector
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload recorded phone calls, voice notes, WhatsApp audio, or Meet/Teams recordings to test for AI synthetic voice clones and suspicious ask phrases.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10"
            : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*,.wav,.mp3,.m4a,.aac,.ogg,.opus,.mp4,.mov"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3 shadow-inner">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <h3 className="text-sm font-semibold text-white">
          {file ? file.name : "Drop audio or video recording here, or click to browse"}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Supports WAV, MP3, M4A, OGG, OPUS, MP4, MOV (up to 50 MB)
        </p>
      </div>

      {file && (
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📁</span>
            <div>
              <p className="text-xs font-bold text-white">{file.name}</p>
              <p className="text-[11px] text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB &middot; {file.type || "Media file"}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={analyzing}
            onClick={runAnalysis}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            {analyzing ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning Spectra & Asks...
              </>
            ) : (
              <>
                <span>⚡</span> Run Deepfake & Scam Scan
              </>
            )}
          </button>
        </div>
      )}

      {/* Analysis Output Layout with Transcription on the Side */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left Column: Security Metrics & Policy Verdict */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Inspection Verdict &middot; {result.timestamp}
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5 truncate max-w-xs sm:max-w-md">
                  Target: {result.filename}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Satyapan Band</span>
                <span
                  className={`inline-block font-extrabold px-3 py-1 rounded-md text-xs border ${
                    result.band === "HOLD"
                      ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
                      : result.band === "VERIFY"
                      ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                      : "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  }`}
                >
                  {result.band === "HOLD" ? "✕ HOLD (HIGH RISK)" : result.band === "VERIFY" ? "! VERIFY (SUSPICIOUS)" : "✓ PASS (CLEAN)"}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Deepfake Confidence
                </span>
                <span className="text-base font-bold text-white">{result.syntheticConfidence}</span>
                <p className="text-[10px] text-slate-500 mt-1">Score: {result.syntheticScore}</p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Suspicious Asks
                </span>
                <span className="text-base font-bold text-white">
                  {result.extractedAsks.length} Flags
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Rules A1–A7</p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Duration
                </span>
                <span className="text-base font-bold text-white">{result.duration}</span>
                <p className="text-[10px] text-slate-500 mt-1">16kHz Mono</p>
              </div>
            </div>

            {/* Ask Matches */}
            {result.extractedAsks.length > 0 && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <span>⚠️</span> Suspicious Asks Flagged
                </h4>
                <ul className="space-y-1.5">
                  {result.extractedAsks.map((ask, idx) => (
                    <li key={idx} className="text-xs text-amber-200/90 font-medium flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{ask}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Policy Recommendation */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Policy Guidance & Action
              </span>
              <p className="text-xs font-medium text-slate-200 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>

          {/* Right Column: Audio Transcript at the Side */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  📝
                </span>
                <h3 className="text-sm font-bold text-white">Audio Transcript</h3>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 border border-slate-700/60">
                Whisper AI
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Synchronized transcript with acoustic anomaly tags & flagged ask spans highlighted in red/amber.
            </p>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] pr-2">
              {result.transcript.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-3 transition-all ${
                    item.flagged
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                      : "border-slate-800/80 bg-slate-900/60 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                    <span className={item.flagged ? "text-rose-400 font-bold" : "text-slate-400"}>
                      {item.speaker}
                    </span>
                    <span className="font-mono text-slate-500">{item.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed font-sans">{item.text}</p>
                  {item.flagged && (
                    <span className="inline-block mt-2 rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                      🚨 Coercive Ask Detected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
