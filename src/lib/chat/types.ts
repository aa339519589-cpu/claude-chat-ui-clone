/**
 * Data-layer contract — UI renders exclusively through these interfaces.
 * Swap `src/lib/chat/mock-provider.ts` for a real backend (LLM API,
 * streaming, history, uploads, TTS/STT) without touching components.
 */

export interface User {
  name: string;
  plan: "Free" | "Pro" | "Max" | "Team";
}

export interface Model {
  id: string;
  name: string;
  /** Thinking level shown next to the model name, e.g. "Medium" */
  effort: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  mime: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  attachments?: Attachment[];
  streaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
}

export type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "done" }
  | { type: "error"; message: string };

/** The single seam between UI and any backend. */
export interface ChatProvider {
  getUser(): Promise<User>;
  listModels(): Promise<Model[]>;
  listConversations(): Promise<Conversation[]>;
  createConversation(title?: string): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  /** Streams assistant deltas for one user turn. */
  sendMessage(opts: {
    conversationId: string;
    content: string;
    attachments?: Attachment[];
    model: Model;
    signal?: AbortSignal;
  }): AsyncIterable<StreamEvent>;
  /** Speech-to-text hook (mic button). */
  transcribe?(audio: Blob): Promise<string>;
  /** Text-to-speech hook. */
  speak?(text: string): Promise<Blob>;
}
