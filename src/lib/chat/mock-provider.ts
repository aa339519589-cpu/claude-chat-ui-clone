import type {
  ChatProvider,
  Conversation,
  Message,
  Model,
  StreamEvent,
  User,
} from "./types";

/**
 * Mock provider — simulates claude.ai behaviour with no backend.
 * Replace with a real implementation of `ChatProvider` to wire up
 * your own LLM API / streaming / history / uploads / TTS / STT.
 */

const MODELS: Model[] = [
  { id: "sonnet-5-5", name: "Sonnet 5.5", effort: "Medium" },
  { id: "opus-5-5", name: "Opus 5.5", effort: "High" },
  { id: "haiku-5-5", name: "Haiku 5.5", effort: "Low" },
];

let conversations: Conversation[] = [];
const user: User = { name: "Alex", plan: "Free" };

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/** Minimal markdown → chunks, so the mock streams look real. */
const REPLY = [
  "Got it — here's how I'd approach that.\n\n",
  "**First**, break the problem into three parts:\n\n",
  "1. Define the data model\n2. Wire the streaming layer\n3. Build the UI on top\n\n",
  "The key insight is that the interface stays stable while the ",
  "implementation swaps underneath:\n\n",
  "```ts\nconst provider: ChatProvider = new RealProvider(apiKey)\n```\n\n",
  "Want me to go deeper on any of these steps?",
].join("");

async function* mockStream(signal?: AbortSignal): AsyncIterable<StreamEvent> {
  const tokens = REPLY.match(/\S+\s*|\s+/g) ?? [REPLY];
  for (const t of tokens) {
    if (signal?.aborted) return;
    await new Promise((r) => setTimeout(r, 24 + Math.random() * 40));
    yield { type: "text", delta: t };
  }
  yield { type: "done" };
}

export const mockProvider: ChatProvider = {
  async getUser() {
    return user;
  },
  async listModels() {
    return MODELS;
  },
  async listConversations() {
    return [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  },
  async createConversation() {
    const c: Conversation = { id: uid(), title: "New chat", updatedAt: Date.now(), messages: [] };
    conversations.push(c);
    return c;
  },
  async deleteConversation(id) {
    conversations = conversations.filter((c) => c.id !== id);
  },
  sendMessage({ conversationId, content, model, signal }) {
    const conv = conversations.find((c) => c.id === conversationId);
    const userMsg: Message = {
      id: uid(),
      role: "user",
      content,
      createdAt: Date.now(),
    };
    if (conv) {
      conv.messages.push(userMsg);
      if (conv.title === "New chat") conv.title = content.slice(0, 42);
      conv.updatedAt = Date.now();
    }
    void model;
    return mockStream(signal);
  },
  async transcribe() {
    return "(voice input is a provider hook — wire STT here)";
  },
};
