"use client";

import { useRef, useCallback, useState } from "react";
import { toPng } from "html-to-image";

interface Props {
  children: React.ReactNode;
  filename?: string;
}

export default function ExportableChart({ children, filename = "chart" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 2,
        backgroundColor: "#0D0D0D",
      });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [filename]);

  return (
    <div>
      <div ref={ref}>{children}</div>
      <div className="flex justify-end mt-2">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-obsidian bg-white border border-card-border rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <path d="M7 1v8m0 0L4 6.5M7 9l3-2.5M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {exporting ? "Exporting…" : "Export PNG"}
        </button>
      </div>
    </div>
  );
}
