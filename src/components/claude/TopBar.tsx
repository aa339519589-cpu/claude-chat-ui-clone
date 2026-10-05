"use client";

import { SidebarIcon, ChevronDownIcon } from "./icons";

/**
 * Top bar — 48px, absolute over the transcript with a fading backdrop,
 * as measured on claude.ai mobile (390×844): trigger 32×32 at (8,8);
 * title button h-7 with 14px/20px truncate; Share h-7 at right-3, disabled.
 */
export function TopBar({
  title,
  onOpenSidebar,
}: {
  title: string;
  onOpenSidebar: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open sidebar"
        className="absolute top-2 left-2 z-50 flex size-8 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-fast hover:bg-hover"
      >
        <SidebarIcon className="size-5" />
      </button>

      <header className="absolute inset-x-0 top-0 z-40 flex h-12 items-center gap-3 pr-3 pl-4">
        {/* backdrop that fades out at the bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -bottom-6 right-3 z-[-1] bg-surface-1 [mask-image:linear-gradient(to_bottom,black_66.67%,transparent)]"
        />
        <div className="ml-10 flex min-w-0 items-center">
          <div className="group flex min-w-0 shrink items-center -ml-1.5">
            <button
              type="button"
              className="flex h-7 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1.5 font-sans text-sm leading-5 font-normal text-primary transition-colors duration-fast hover:bg-hover"
            >
              <span className="min-w-0 truncate">{title}</span>
            </button>
            <button
              type="button"
              aria-label="Conversation options"
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-fast hover:bg-hover"
            >
              <ChevronDownIcon className="size-4" />
            </button>
          </div>
        </div>
        <div className="h-full min-w-0 flex-1" />
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled
            className="flex h-7 cursor-default items-center justify-center gap-1.5 rounded-lg px-3 font-sans text-sm leading-5 font-normal text-disabled opacity-disabled"
          >
            Share
          </button>
        </div>
      </header>
    </>
  );
}
