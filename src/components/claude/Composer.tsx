"use client";

import { useEffect, useRef } from "react";
import type { Model } from "@/lib/chat/types";
import {
  PlusIcon,
  MicIcon,
  WaveformIcon,
  ChevronDownIcon,
  ArrowUpIcon,
} from "./icons";
import { ModelSelector } from "./ModelSelector";

/**
 * Composer — measured from the live page at 390×844:
 * outer px-2 (8px); card bg-surface-3, radius 14px, p-2 (8px);
 * textarea 13px/18px, pl-[6px], pt/row-py 7px, reserves 38px toolbar
 * row (h-control 32 + gap 6); auto-grow max-h 384px; placeholder
 * "Tell Claude what you're working on"; chin row 12px/17px with the
 * model selector at the right.
 */
export function Composer({
  value,
  onChange,
  onSend,
  onStop,
  pending,
  models,
  model,
  onModelChange,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  pending: boolean;
  models: Model[];
  model: Model | null;
  onModelChange: (m: Model) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  // auto-grow, capped at max-h-96 (384px) then scrolls
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 384)}px`;
  }, [value]);

  return (
    <div className="pointer-events-none sticky bottom-0 z-[5] w-full pt-6">
      <div className="pointer-events-auto mx-auto w-full max-w-[calc(48rem+1rem)] px-2">
        {/* input card */}
        <div className="relative flex w-full min-w-0 flex-col rounded-composer bg-surface-3 p-2 text-primary">
          <div className="relative min-w-0">
            <textarea
              ref={ref}
              rows={1}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  if (!pending) onSend();
                }
              }}
              placeholder="Tell Claude what you're working on"
              aria-label="Write something to Claude"
              className="no-scrollbar block max-h-96 min-h-[70px] w-full resize-none bg-transparent pb-[38px] pr-1 pl-[6px] pt-[7px] text-[13px] leading-[18px] font-normal break-words text-primary caret-primary outline-none placeholder:text-ink-3"
            />
            {/* placeholder overlays the empty textarea (matches the live span) */}
            {!hasText && (
              <span
                aria-hidden
                className="pointer-events-none absolute top-[7px] left-[6px] max-w-full truncate text-[13px] leading-[18px] font-normal text-ink-3"
              >
                Tell Claude what you&apos;re working on
              </span>
            )}
            {/* bottom toolbar inside the card */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between">
              <button
                type="button"
                aria-label="Add files"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-fast hover:bg-hover"
              >
                <PlusIcon className="size-5" />
              </button>

              <div className="flex shrink-0 items-center gap-1">
                {pending ? (
                  <button
                    type="button"
                    onClick={onStop}
                    aria-label="Stop response"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-2 text-primary transition-colors duration-fast hover:bg-hover"
                  >
                    <span className="size-2.5 rounded-[2px] bg-primary" />
                  </button>
                ) : hasText ? (
                  <button
                    type="button"
                    onClick={onSend}
                    aria-label="Send message"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-clay text-black transition-colors duration-fast hover:bg-clay-2"
                  >
                    <ArrowUpIcon className="size-4" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="Dictate"
                      className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-fast hover:bg-hover"
                    >
                      <MicIcon className="size-5" />
                    </button>
                    <div className="flex h-8 items-center rounded-lg ring-inset-line">
                      <button
                        type="button"
                        aria-label="Voice mode"
                        className="flex size-8 cursor-pointer items-center justify-center rounded-l-lg text-primary transition-colors duration-fast hover:bg-hover"
                      >
                        <WaveformIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Voice options"
                        className="flex h-8 w-[15px] cursor-pointer items-center justify-center rounded-r-lg pr-1 text-primary transition-colors duration-fast hover:bg-hover"
                      >
                        <ChevronDownIcon className="size-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* chin: disclaimer + model selector */}
        <div className="mt-1.5 mb-2 flex h-6 items-center justify-between px-1 text-xs leading-[17px] font-normal">
          <span className="min-w-0 text-ink-3">
            Claude is AI and can make mistakes.
          </span>
          <ModelSelector
            models={models}
            value={model}
            onChange={onModelChange}
          />
        </div>
      </div>
    </div>
  );
}
