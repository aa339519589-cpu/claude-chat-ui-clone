"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Attachment,
  ChatProvider,
  Conversation,
  Message,
  Model,
  StreamEvent,
  User,
} from "@/lib/chat/types";

export interface ChatState {
  user: User | null;
  conversations: Conversation[];
  activeId: string | null;
  active: Conversation | null;
  messages: Message[];
  models: Model[];
  model: Model | null;
  setModel: (m: Model) => void;
  /** streaming assistant turn in flight */
  pending: boolean;
  /** composer is submitting (optimistic user turn) */
  submitting: boolean;
  /** file upload channel (provider hook) */
  uploads: Attachment[];
  addUpload: (a: Attachment) => void;
  removeUpload: (id: string) => void;
  send: (text: string) => Promise<void>;
  stop: () => void;
  newChat: () => Promise<void>;
  openConversation: (id: string) => void;
  deleteConversation: (id: string) => Promise<void>;
}

export function useChat(provider: ChatProvider): ChatState {
  const [user, setUser] = useState<ChatState["user"]>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModelState] = useState<Model | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploads, setUploads] = useState<Attachment[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    provider.getUser().then((u) => alive && setUser(u));
    provider.listModels().then((ms) => {
      if (!alive) return;
      setModels(ms);
      setModelState((cur) => cur ?? ms[0] ?? null);
    });
    return () => {
      alive = false;
    };
  }, [provider]);

  const refreshConversations = useCallback(async () => {
    setConversations(await provider.listConversations());
  }, [provider]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if ((!trimmed && uploads.length === 0) || !model) return;
      let conv = conversations.find((c) => c.id === activeId);
      if (!conv) {
        conv = await provider.createConversation();
        setActiveId(conv.id);
      }
      const cid = conv.id;
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        attachments: uploads.length ? uploads : undefined,
        createdAt: Date.now(),
      };
      const asstId = `a-${Date.now()}`;
      setSubmitting(true);
      setConversations((cs) =>
        cs.map((c) =>
          c.id === cid
            ? {
                ...c,
                title: c.messages.length === 0 ? trimmed.slice(0, 42) : c.title,
                updatedAt: Date.now(),
                messages: [
                  ...c.messages,
                  userMsg,
                  { id: asstId, role: "assistant", content: "", createdAt: Date.now(), streaming: true },
                ],
              }
            : c,
        ),
      );
      setUploads([]);
      setSubmitting(false);
      setPending(true);
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        for await (const ev of provider.sendMessage({
          conversationId: cid,
          content: trimmed,
          attachments: userMsg.attachments,
          model,
          signal: ac.signal,
        })) {
          const e = ev as StreamEvent;
          if (e.type === "text") {
            setConversations((cs) =>
              cs.map((c) =>
                c.id === cid
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === asstId ? { ...m, content: m.content + e.delta } : m,
                      ),
                    }
                  : c,
              ),
            );
          } else if (e.type === "error") {
            setConversations((cs) =>
              cs.map((c) =>
                c.id === cid
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === asstId ? { ...m, content: m.content + `\n\n${e.message}`, streaming: false } : m,
                      ),
                    }
                  : c,
              ),
            );
          }
        }
      } finally {
        setConversations((cs) =>
          cs.map((c) =>
            c.id === cid
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === asstId ? { ...m, streaming: false } : m,
                  ),
                }
              : c,
          ),
        );
        setPending(false);
        abortRef.current = null;
        void refreshConversations();
      }
    },
    [activeId, conversations, model, provider, refreshConversations, uploads],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPending(false);
  }, []);

  const newChat = useCallback(async () => {
    abortRef.current?.abort();
    setActiveId(null);
    setPending(false);
  }, []);

  const openConversation = useCallback((id: string) => {
    abortRef.current?.abort();
    setActiveId(id);
    setPending(false);
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      await provider.deleteConversation(id);
      setActiveId((cur) => (cur === id ? null : cur));
      void refreshConversations();
    },
    [provider, refreshConversations],
  );

  const addUpload = useCallback((a: Attachment) => setUploads((u) => [...u, a]), []);
  const removeUpload = useCallback(
    (id: string) => setUploads((u) => u.filter((x) => x.id !== id)),
    [],
  );

  return {
    user,
    conversations,
    activeId,
    active,
    messages: active?.messages ?? [],
    models,
    model,
    setModel: setModelState,
    pending,
    submitting,
    uploads,
    addUpload,
    removeUpload,
    send,
    stop,
    newChat,
    openConversation,
    deleteConversation,
  };
}
