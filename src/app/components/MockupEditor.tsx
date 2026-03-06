"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { toPng } from "html-to-image";
import { track } from "@vercel/analytics";
import { useLicense } from "../hooks/useLicense";

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
  const [bgIndex, setBgIndex] = useState(0);
  const [padding, setPadding] = useState(64);
  const [borderRadius, setBorderRadius] = useState(12);
  const [shadowIndex, setShadowIndex] = useState(2);
  const [frame, setFrame] = useState<FrameType>("none");
  const [isExporting, setIsExporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      track("image_uploaded", { method: "file" });
    };
    reader.readAsDataURL(file);
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
        background: BACKGROUNDS[bgIndex].name,
        isPro: isPro ? "yes" : "no",
        resolution: isPro ? "4x" : "2x",
      });
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const bg = BACKGROUNDS[bgIndex];
  const shadow = SHADOWS[shadowIndex];
  const isDarkBg = [6, 11].includes(bgIndex);

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

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Preview Area */}
      <div className="flex-1 min-h-[420px] flex items-center justify-center bg-gray-50 rounded-2xl p-4 lg:p-6 overflow-auto border border-gray-200">
        {!image ? (
          <div
            className={`w-full h-[420px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer ${
              isDragging ? "border-violet-500 bg-violet-50" : "border-gray-300 hover:border-violet-400 hover:bg-white"
            }`}
            onDrop={handleDrop}
            onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-lg font-semibold text-gray-500">Drop your screenshot here</p>
            <p className="text-sm text-gray-400 mt-2">or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Ctrl+V to paste from clipboard</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>
        ) : (
          <div
            ref={canvasRef}
            style={{ background: bg.css, padding: `${padding}px`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minWidth: "280px" }}
          >
            {renderContent()}
            {/* Watermark — hidden for Pro users */}
            {!isPro && (
              <div
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
      <div className="lg:w-72 xl:w-80 space-y-5 shrink-0">
        {/* Pro Badge */}
        {isPro && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-lg text-white text-sm font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            Pro Activated &mdash; 4x Export, No Watermark
          </div>
        )}

        {/* Background */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Background</label>
          <div className="grid grid-cols-6 gap-2">
            {BACKGROUNDS.map((g, i) => (
              <button
                key={i}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${i === bgIndex ? "border-violet-500 ring-2 ring-violet-200 scale-110" : "border-gray-200 hover:border-gray-400"}`}
                style={{ background: g.css }}
                onClick={() => setBgIndex(i)}
                title={g.name}
              />
            ))}
          </div>
        </div>

        {/* Padding */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Padding</label>
            <span className="text-sm text-gray-400 tabular-nums">{padding}px</span>
          </div>
          <input type="range" min={16} max={128} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full" />
        </div>

        {/* Border Radius (only for no-frame) */}
        {frame === "none" && (
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Corners</label>
              <span className="text-sm text-gray-400 tabular-nums">{borderRadius}px</span>
            </div>
            <input type="range" min={0} max={32} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full" />
          </div>
        )}

        {/* Shadow */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Shadow</label>
          <div className="grid grid-cols-4 gap-2">
            {SHADOWS.map((s, i) => (
              <button key={i} className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all ${i === shadowIndex ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 hover:border-gray-400 text-gray-600"}`} onClick={() => setShadowIndex(i)}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Frame */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Frame</label>
          <div className="grid grid-cols-3 gap-2">
            {(["none", "browser", "phone"] as FrameType[]).map((f) => (
              <button key={f} className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all capitalize ${frame === f ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 hover:border-gray-400 text-gray-600"}`} onClick={() => setFrame(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleExport}
            disabled={!image || isExporting}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PNG {isPro && "(4x)"}
              </>
            )}
          </button>

          {image && (
            <button onClick={() => setImage(null)} className="w-full py-2.5 px-4 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-400 text-sm font-medium rounded-xl transition-colors">
              Upload new image
            </button>
          )}
        </div>

        {/* Pro CTA — only show when not Pro */}
        {!isPro && (
          <div className="p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl border border-violet-100">
            <p className="text-sm font-semibold text-violet-800">Remove watermark</p>
            <p className="text-xs text-violet-600 mt-1 leading-relaxed">
              Get SnapMock Pro for just $9 &mdash; one-time payment, lifetime access.
            </p>
            <a href="#pricing" className="inline-block mt-2 text-xs font-semibold text-violet-700 hover:text-violet-900 transition-colors" onClick={() => track("pro_cta_click", { location: "editor_sidebar" })}>
              Learn more &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
