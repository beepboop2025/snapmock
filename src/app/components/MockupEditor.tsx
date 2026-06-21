"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { toPng } from "html-to-image";
import { track } from "@vercel/analytics";
import { useLicense } from "../hooks/useLicense";
import { isDarkColor } from "../lib/color";

const BACKGROUNDS = [
  { name: "Lavender", css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Ocean", css: "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)" },
  { name: "Sunset", css: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Peach", css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Mint", css: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Berry", css: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { name: "Night", css: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { name: "Coral", css: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { name: "Sky", css: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
  { name: "Gold", css: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
  { name: "White", css: "#ffffff" },
  { name: "Dark", css: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
];

const SHADOWS = [
  { name: "None", css: "none" },
  { name: "Subtle", css: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)" },
  { name: "Medium", css: "0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)" },
  { name: "Heavy", css: "0 25px 50px -12px rgba(0,0,0,0.4)" },
];

type FrameType = "none" | "browser" | "phone";

function BrowserFrame({ children, shadow }: { children: React.ReactNode; shadow: string }) {
  return (
    <div style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "#ffffff", boxShadow: shadow }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", backgroundColor: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
        </div>
        <div style={{ flex: 1, maxWidth: "400px", margin: "0 auto" }}>
          <div style={{ padding: "4px 12px", backgroundColor: "#ffffff", borderRadius: "6px", fontSize: "12px", color: "#9ca3af", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
            snapmock.vercel.app
          </div>
        </div>
        <div style={{ width: "48px" }} />
      </div>
      <div>{children}</div>
    </div>
  );
}

function PhoneFrame({ children, shadow }: { children: React.ReactNode; shadow: string }) {
  return (
    <div style={{ borderRadius: "44px", border: "10px solid #1f2937", backgroundColor: "#1f2937", overflow: "hidden", position: "relative", width: "320px", boxShadow: shadow }}>
      <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", width: "100px", height: "28px", backgroundColor: "#1f2937", borderRadius: "14px", zIndex: 10 }} />
      <div style={{ borderRadius: "34px", overflow: "hidden" }}>{children}</div>
      <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", width: "100px", height: "4px", backgroundColor: "#6b7280", borderRadius: "2px" }} />
    </div>
  );
}

export default function MockupEditor() {
  const { isPro } = useLicense();
  const [image, setImage] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0); // -1 = custom color
  const [customColor, setCustomColor] = useState("#7c3aed");
  const [padding, setPadding] = useState(64);
  const [borderRadius, setBorderRadius] = useState(12);
  const [shadowIndex, setShadowIndex] = useState(2);
  const [frame, setFrame] = useState<FrameType>("none");
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setImage((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            track("image_uploaded", { method: "paste" });
          }
          break;
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
        track("image_uploaded", { method: "drop" });
      }
    },
    [handleFile]
  );

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportDone(false);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        pixelRatio: isPro ? 4 : 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `snapmock-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      track("export_png", {
        frame,
        background: bgIndex === -1 ? "custom" : BACKGROUNDS[bgIndex].name,
        isPro: isPro ? "yes" : "no",
        resolution: isPro ? "4x" : "2x",
      });
      setExportDone(true);
      setTimeout(() => setExportDone(false), 2500);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const bg = bgIndex === -1 ? { name: "Custom", css: customColor } : BACKGROUNDS[bgIndex];
  const shadow = SHADOWS[shadowIndex];
  const isDarkBg = bgIndex === -1
    ? isDarkColor(customColor)
    : [6, 11].includes(bgIndex);

  const renderContent = () => {
    if (!image) return null;
    const imgStyle: React.CSSProperties = {
      display: "block",
      width: "100%",
      maxWidth: frame === "phone" ? "100%" : "800px",
    };
    if (frame === "browser") {
      return (
        <BrowserFrame shadow={shadow.css}>
          <img src={image} alt="Screenshot" style={imgStyle} />
        </BrowserFrame>
      );
    }
    if (frame === "phone") {
      return (
        <PhoneFrame shadow={shadow.css}>
          <img src={image} alt="Screenshot" style={imgStyle} />
        </PhoneFrame>
      );
    }
    return (
      <img
        src={image}
        alt="Screenshot"
        style={{ ...imgStyle, borderRadius: `${borderRadius}px`, boxShadow: shadow.css }}
      />
    );
  };

  const FRAME_ICONS: Record<FrameType, React.ReactNode> = {
    none: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    browser: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    phone: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Preview Area */}
      <div className="flex-1 min-h-[420px] flex items-center justify-center glass rounded-2xl p-4 lg:p-6 overflow-auto noise-overlay">
        {!image ? (
          <div
            className={`upload-glow w-full h-[420px] flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-500 ease-out ${
              isDragging
                ? "upload-border-active bg-violet-500/10 scale-[1.02] shadow-[0_0_40px_rgba(124,58,237,0.15)]"
                : "upload-border hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(124,58,237,0.08)]"
            }`}
            onDrop={handleDrop}
            onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); if (!isDragging) setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={`transition-all duration-500 ease-out ${isDragging ? "scale-110 -translate-y-1" : ""}`}>
              <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center transition-all duration-500 ${isDragging ? "bg-violet-500/10 border-violet-500/20 shadow-lg shadow-violet-500/10" : ""}`}>
                <svg className={`w-9 h-9 transition-colors duration-500 ${isDragging ? "text-violet-400" : "text-white/20"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white/40">Drop your screenshot here</p>
              <p className="text-sm text-white/25 mt-2">or click to browse</p>
              <div className="mt-4 flex items-center gap-2 justify-center">
                <kbd className="px-2 py-1 text-[10px] font-mono text-white/20 bg-white/[0.04] border border-white/[0.06] rounded-md">Ctrl+V</kbd>
                <span className="text-xs text-white/15">to paste from clipboard</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) { handleFile(e.target.files[0]); track("image_uploaded", { method: "file" }); } }} />
          </div>
        ) : (
          <div
            ref={canvasRef}
            className="transition-all duration-700 ease-out"
            style={{ background: bg.css, padding: `${padding}px`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minWidth: "280px" }}
          >
            {renderContent()}
            {/* Watermark -- hidden for Pro users */}
            {!isPro && (
              <div
                className="transition-opacity duration-300"
                style={{
                  position: "absolute", bottom: "6px", right: "10px",
                  fontSize: "10px", fontWeight: 600, opacity: 0.35,
                  color: isDarkBg ? "#ffffff" : "#000000",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                Made with SnapMock
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls Panel */}
      <div className="lg:w-72 xl:w-80 space-y-4 shrink-0">
        {/* Pro Badge */}
        {isPro && (
          <div className="shimmer flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-xl text-white text-sm font-semibold shadow-lg shadow-violet-500/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            Pro Activated &mdash; 4x Export, No Watermark
          </div>
        )}

        {/* Background */}
        <div className="glass-panel rounded-xl p-4">
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Background</label>
          <div className="grid grid-cols-6 gap-2">
            {BACKGROUNDS.map((g, i) => (
              <button
                key={i}
                className={`w-full aspect-square rounded-lg transition-all duration-300 ease-out ${
                  i === bgIndex
                    ? "swatch-active scale-110 shadow-lg"
                    : "border border-white/10 hover:border-white/25 hover:scale-110 hover:shadow-md"
                }`}
                style={{ background: g.css }}
                onClick={() => setBgIndex(i)}
                title={g.name}
                data-tooltip={g.name}
              />
            ))}
          </div>
          {/* Custom Color Picker -- Pro only */}
          {isPro ? (
            <div className="mt-3 flex items-center gap-2">
              <label
                htmlFor="custom-color-input"
                className={`w-8 h-8 rounded-lg transition-all duration-300 shrink-0 cursor-pointer ${
                  bgIndex === -1
                    ? "swatch-active scale-110"
                    : "border border-white/10 hover:border-white/25 hover:scale-110"
                }`}
                style={{ background: customColor }}
                title="Pick a custom color"
              />
              <input
                type="color"
                value={customColor}
                onChange={(e) => { setCustomColor(e.target.value); setBgIndex(-1); }}
                className="w-0 h-0 opacity-0 absolute"
                id="custom-color-input"
              />
              <label
                htmlFor="custom-color-input"
                className="text-xs text-violet-400 font-medium cursor-pointer hover:text-violet-300 transition-colors duration-300"
              >
                Custom color
              </label>
              <span className="text-xs text-white/25 font-mono ml-auto">{customColor}</span>
            </div>
          ) : (
            <p className="mt-3 text-xs text-white/25">
              <a href="#pricing" className="text-violet-400 hover:text-violet-300 transition-colors duration-300">Pro</a> unlocks custom color backgrounds
            </p>
          )}
        </div>

        {/* Padding */}
        <div className="glass-panel rounded-xl p-4">
          <div className="flex justify-between mb-3">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Padding</label>
            <span className="text-xs text-white/35 tabular-nums bg-white/[0.04] px-2 py-0.5 rounded-md font-mono border border-white/[0.04]">{padding}px</span>
          </div>
          <input type="range" min={16} max={128} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full" />
        </div>

        {/* Border Radius (only for no-frame) */}
        {frame === "none" && (
          <div className="glass-panel rounded-xl p-4 slide-down">
            <div className="flex justify-between mb-3">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Corners</label>
              <span className="text-xs text-white/35 tabular-nums bg-white/[0.04] px-2 py-0.5 rounded-md font-mono border border-white/[0.04]">{borderRadius}px</span>
            </div>
            <input type="range" min={0} max={32} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full" />
          </div>
        )}

        {/* Shadow */}
        <div className="glass-panel rounded-xl p-4">
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Shadow</label>
          <div className="grid grid-cols-4 gap-1.5">
            {SHADOWS.map((s, i) => (
              <button
                key={i}
                className={`btn-press py-2 px-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                  i === shadowIndex
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                    : "border border-white/[0.06] hover:border-white/15 text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                }`}
                onClick={() => setShadowIndex(i)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Frame */}
        <div className="glass-panel rounded-xl p-4">
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Frame</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["none", "browser", "phone"] as FrameType[]).map((f) => (
              <button
                key={f}
                className={`btn-press py-2.5 px-3 text-xs font-medium rounded-lg transition-all duration-300 capitalize flex items-center justify-center gap-1.5 ${
                  frame === f
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                    : "border border-white/[0.06] hover:border-white/15 text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                }`}
                onClick={() => setFrame(f)}
              >
                {FRAME_ICONS[f]}
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleExport}
            disabled={!image || isExporting}
            className={`glow-btn w-full py-3.5 px-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              exportDone
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 success-burst"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 hover:shadow-xl hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] text-white disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Exporting...
              </>
            ) : exportDone ? (
              <>
                <svg className="w-5 h-5 check-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Downloaded!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PNG {isPro && "(4x)"}
              </>
            )}
          </button>

          {image && (
            <button
              onClick={() => { if (image && image.startsWith("blob:")) URL.revokeObjectURL(image); setImage(null); setExportDone(false); }}
              className="btn-press w-full py-2.5 px-4 border border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/15 hover:bg-white/[0.04] text-sm font-medium rounded-xl transition-all duration-300"
            >
              Upload new image
            </button>
          )}
        </div>

        {/* Pro CTA -- only show when not Pro */}
        {!isPro && (
          <div className="relative p-4 rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/8 to-fuchsia-500/5 overflow-hidden gradient-border">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <p className="text-sm font-semibold text-violet-300 relative">Remove watermark</p>
            <p className="text-xs text-violet-400/60 mt-1 leading-relaxed relative">
              Get SnapMock Pro for just $9 &mdash; one-time payment, lifetime access.
            </p>
            <a href="#pricing" className="relative inline-block mt-2.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors duration-300" onClick={() => track("pro_cta_click", { location: "editor_sidebar" })}>
              Learn more &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
