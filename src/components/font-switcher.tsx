"use client";

import { useEffect, useState } from "react";

import {
  FONT_PRESETS,
  LABEL_MODES,
  type FontPreset,
  type LabelMode,
} from "@/lib/fonts";

const PRESET_KEY = "font-preset";
const LABEL_KEY = "font-label-mode";

/**
 * Development-only preview panel for swapping the whole site's typography.
 *
 * Assets for a preset are fetched the first time it is selected, then the
 * `--font-display` / `--font-sans` custom properties are overridden on <html>.
 * Because everything happens at runtime, none of the alternative fonts are in
 * the production bundle — the layout only mounts this component in dev.
 */
export function FontSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("default");
  const [labelMode, setLabelMode] = useState<LabelMode>("mono");

  useEffect(() => {
    const savedPreset = localStorage.getItem(PRESET_KEY) ?? "default";
    const savedLabel = (localStorage.getItem(LABEL_KEY) ?? "mono") as LabelMode;
    applyBoth(savedPreset, savedLabel);
    // Run once on mount; later changes go through the click handlers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyBoth(id: string, mode: LabelMode) {
    const preset = FONT_PRESETS.find((p) => p.id === id) ?? FONT_PRESETS[0];
    loadAssets(preset);

    const root = document.documentElement;

    // These are the role properties from :root, not the `@theme` aliases —
    // the aliases get expanded into the utilities at build time and are not
    // live. See the comment beside their definitions in globals.css.
    if (preset.id === "default") {
      // Fall back to whatever globals.css declares rather than pinning it.
      root.style.removeProperty("--display-font");
      root.style.removeProperty("--sans-font");
    } else {
      root.style.setProperty("--display-font", preset.display);
      root.style.setProperty("--sans-font", preset.sans);
    }

    // --label-font only; --mono-font is left alone so code stays monospaced.
    if (mode === "mono") root.style.removeProperty("--label-font");
    else if (mode === "sans")
      root.style.setProperty("--label-font", preset.sans);
    else root.style.setProperty("--label-font", preset.display);

    localStorage.setItem(PRESET_KEY, preset.id);
    localStorage.setItem(LABEL_KEY, mode);
    setActive(preset.id);
    setLabelMode(mode);
  }

  return (
    <div className="no-print fixed bottom-4 right-4 z-50 font-mono text-xs">
      {open && (
        <div className="mb-2 w-80 overflow-hidden rounded-lg border border-hairline bg-background shadow-lg">
          <div className="border-b border-hairline px-3 py-2 text-[0.6875rem] uppercase tracking-[0.15em] text-faint">
            Font preset · dev only
          </div>

          <ul className="max-h-[60vh] overflow-y-auto">
            {FONT_PRESETS.map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  onClick={() => applyBoth(preset.id, labelMode)}
                  className={`block w-full border-b border-hairline px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-surface ${
                    active === preset.id ? "bg-surface" : ""
                  }`}
                >
                  <span
                    className={
                      active === preset.id ? "text-accent" : "text-foreground"
                    }
                  >
                    {active === preset.id ? "● " : "○ "}
                    {preset.label}
                  </span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-relaxed text-faint">
                    {preset.note}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-hairline px-3 py-2.5">
            <p className="text-[0.6875rem] uppercase tracking-[0.15em] text-faint">
              라벨 (날짜·태그·섹션명·워드마크)
            </p>
            <div className="mt-2 flex gap-1">
              {LABEL_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  title={mode.note}
                  onClick={() => applyBoth(active, mode.id)}
                  className={`flex-1 rounded border px-2 py-1.5 text-[0.6875rem] transition-colors ${
                    labelMode === mode.id
                      ? "border-accent text-accent"
                      : "border-hairline text-faint hover:text-foreground"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[0.6875rem] leading-relaxed text-faint">
              코드 블록은 여기서 안 바뀝니다 — 항상 고정폭입니다.
            </p>
          </div>

          <p className="border-t border-hairline px-3 py-2 text-[0.6875rem] leading-relaxed text-faint">
            선택은 localStorage에 저장됩니다. 프로덕션 빌드에는 이 패널도, 기본
            프리셋 외의 폰트도 포함되지 않습니다.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-hairline bg-background px-3 py-1.5 text-faint shadow-sm transition-colors hover:border-accent hover:text-accent"
      >
        {open ? "닫기" : "Aa 폰트"}
      </button>
    </div>
  );
}

/** Injects a preset's stylesheets / @font-face rules once per preset. */
function loadAssets(preset: FontPreset) {
  for (const href of preset.stylesheets ?? []) {
    if (document.querySelector(`link[data-font-preset][href="${href}"]`)) {
      continue;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.fontPreset = preset.id;
    document.head.append(link);
  }

  if (preset.faces && !document.getElementById(`font-faces-${preset.id}`)) {
    const style = document.createElement("style");
    style.id = `font-faces-${preset.id}`;
    style.textContent = preset.faces;
    document.head.append(style);
  }
}
