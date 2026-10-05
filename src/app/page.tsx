"use client";

import { useState } from "react";
import { mockProvider } from "@/lib/chat/mock-provider";
import { useChat } from "@/hooks/useChat";
import { TopBar } from "@/components/claude/TopBar";
import { Sidebar } from "@/components/claude/Sidebar";
import { Greeting } from "@/components/claude/Greeting";
import { MessageList } from "@/components/claude/MessageList";
import { Composer } from "@/components/claude/Composer";

export default function Home() {
  const chat = useChat(mockProvider);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");

  const send = async () => {
    const text = input;
    setInput("");
    await chat.send(text);
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-surface-1 text-primary">
      <TopBar
        title={chat.active?.title ?? "New chat"}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto pt-12">
        <div className="mx-auto flex min-h-full w-full max-w-[calc(48rem+2.5rem)] flex-col px-5 pt-2">
          {chat.messages.length === 0 ? (
            <Greeting name={chat.user?.name ?? "there"} />
          ) : (
            <div className="mt-auto">
              <MessageList messages={chat.messages} />
            </div>
          )}
        </div>
      </main>

      <Composer
        value={input}
        onChange={setInput}
        onSend={send}
        onStop={chat.stop}
        pending={chat.pending}
        models={chat.models}
        model={chat.model}
        onModelChange={chat.setModel}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={chat.user}
        conversations={chat.conversations}
        activeId={chat.activeId}
        onNewChat={() => {
          void chat.newChat();
        }}
        onOpenConversation={(id) => {
          chat.openConversation(id);
          setSidebarOpen(false);
        }}
      />
    </div>
  );
}
