"use client";

import { useEffect } from "react";
import type { Conversation, User } from "@/lib/chat/types";
import { SparkIcon, XIcon, PlusIcon } from "./icons";

/**
 * Mobile sidebar drawer — full-width sheet sliding from the left,
 * bg #111111, px-2 pt-3 pb-1.5, transform 0.3s cubic-bezier(.165,.84,.44,1),
 * measured from the live dframe-sidebar at 390×844.
 */
export function Sidebar({
  open,
  onClose,
  user,
  conversations,
  activeId,
  onNewChat,
  onOpenConversation,
}: {
  open: boolean;
  onClose: () => void;
  user: User | null;
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onOpenConversation: (id: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-backdrop transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* sheet */}
      <aside
        role="dialog"
        aria-label="Chats"
        className={`fixed inset-y-0 left-0 z-[70] flex w-full max-w-[390px] flex-col gap-2 bg-drawer px-2 pt-3 pb-1.5 transition-transform duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* header: logo + close */}
        <div className="flex h-11 shrink-0 items-center gap-2 px-1">
          <SparkIcon className="size-5 shrink-0 text-clay" />
          <span className="text-base font-semibold text-primary">Claude</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="ml-auto flex size-8 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-fast hover:bg-hover"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* new chat */}
        <button
          type="button"
          onClick={onNewChat}
          className="flex h-10 w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] px-4 text-left text-[15px] leading-[22px] font-normal text-primary transition-colors duration-fast hover:bg-hover"
        >
          <PlusIcon className="size-5" />
          New chat
        </button>

        {/* conversation list */}
        <div className="-mx-1 flex min-h-0 flex-1 flex-col overflow-y-auto px-1 no-scrollbar">
          {conversations.length > 0 && (
            <div className="px-3 pt-3 pb-1 text-xs leading-4 font-normal text-ink-3">
              Recents
            </div>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpenConversation(c.id)}
              className={`flex h-10 w-full shrink-0 cursor-pointer items-center rounded-lg px-3 text-left text-sm leading-5 font-normal text-primary transition-colors duration-fast hover:bg-hover ${
                c.id === activeId ? "bg-fill-secondary" : ""
              }`}
            >
              <span className="min-w-0 truncate">{c.title}</span>
            </button>
          ))}
        </div>

        {/* bottom tray: account */}
        <button
          type="button"
          className="flex h-12 w-full shrink-0 cursor-pointer items-center gap-2 rounded-[10px] px-2 text-left transition-colors duration-fast hover:bg-hover"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-clay text-xs font-medium text-black">
            {(user?.name ?? "A").slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 truncate text-sm leading-5 font-normal text-primary">
            {user?.name ?? "Alex"}
          </span>
          <span className="ml-auto text-xs leading-4 font-normal text-ink-3">
            {user?.plan ?? "Free"}
          </span>
        </button>
      </aside>
    </>
  );
}
