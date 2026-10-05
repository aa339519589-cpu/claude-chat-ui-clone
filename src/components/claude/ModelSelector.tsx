"use client";

import { useState } from "react";
import type { Model } from "@/lib/chat/types";
import { CheckIcon } from "./icons";

/**
 * Model selector chip in the composer chin — opens a popover upward.
 * Trigger: "Sonnet 5.5" + dimmer "Medium", 12px/17px (measured 128×24 hit area).
 */
export function ModelSelector({
  models,
  value,
  onChange,
}: {
  models: Model[];
  value: Model | null;
  onChange: (m: Model) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {open && (
        <div
          aria-hidden
          className="fixed inset-0 z-10"
          onClick={() => setOpen(false)}
        />
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Choose model"
        className="flex h-6 cursor-pointer items-center gap-1.5 rounded-md px-1 text-xs leading-[17px] font-normal text-ink-2 transition-colors duration-fast hover:bg-hover"
      >
        <span>{value?.name ?? "Sonnet 5.5"}</span>
        <span className="text-ink-3">{value?.effort ?? "Medium"}</span>
      </button>

      {open && (
        <div className="absolute right-0 bottom-full z-20 mb-2 w-60 rounded-xl border border-line bg-surface-2 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          <div className="px-2 py-1.5 text-xs leading-4 font-normal text-ink-3">
            Choose a model
          </div>
          {models.map((m) => {
            const selected = value?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChange(m);
                  setOpen(false);
                }}
                className="flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-2 text-left text-sm leading-5 font-normal text-primary transition-colors duration-fast hover:bg-hover"
              >
                <span className="flex min-w-0 items-baseline">
                  <span className="truncate">{m.name}</span>
                  <span className="ml-2 shrink-0 text-xs leading-4 text-ink-3">
                    {m.effort}
                  </span>
                </span>
                {selected && <CheckIcon className="size-4 shrink-0 text-clay" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
