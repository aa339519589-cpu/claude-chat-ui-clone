"use client";

import type { Message } from "@/lib/chat/types";
import { Markdown } from "./Markdown";

/**
 * Transcript — user turns as right-aligned rounded bubbles on
 * bg-surface-2 (measured: radius 16px, px-4 py-2.5, 15px/24px text,
 * max-w 85%); assistant turns as full-width prose 16px/24px on the
 * page background, with a pulsing clay caret while streaming.
 */
export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl bg-surface-2 px-4 py-2.5 text-[15px] leading-6 font-normal whitespace-pre-wrap text-primary">
              {m.content}
            </div>
          </div>
        ) : (
          <div
            key={m.id}
            className="font-sans text-base leading-6 font-normal break-words text-primary"
          >
            <Markdown text={m.content} />
            {m.streaming && <span className="stream-caret" aria-hidden />}
          </div>
        ),
      )}
    </div>
  );
}
