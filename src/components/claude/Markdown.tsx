import type { ReactNode } from "react";

/**
 * Minimal markdown renderer covering what the mock assistant emits and
 * typical replies: fenced code, headings, ordered/unordered lists,
 * paragraphs, and inline bold / italic / inline-code.
 */
export function Markdown({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const segments = text.split(/```/);

  segments.forEach((seg, i) => {
    if (i % 2 === 1) {
      // fenced code block — first line may be a language tag
      const nl = seg.indexOf("\n");
      const body = nl === -1 ? seg : seg.slice(nl + 1);
      nodes.push(
        <pre
          key={`c${i}`}
          className="my-2 overflow-x-auto rounded-lg border border-line bg-surface-0 p-3 font-mono text-[13px] leading-[19px] text-ink-2"
        >
          <code>{body.replace(/\n$/, "")}</code>
        </pre>,
      );
      return;
    }
    // non-code: split into lines, group lists
    const lines = seg.split("\n");
    let list: { ordered: boolean; items: string[] } | null = null;
    const flush = () => {
      if (!list) return;
      const Tag = list.ordered ? "ol" : "ul";
      nodes.push(
        <Tag
          key={`l${nodes.length}`}
          className={`my-2 pl-6 ${list.ordered ? "list-decimal" : "list-disc"} marker:text-ink-3`}
        >
          {list.items.map((it, j) => (
            <li key={j} className="my-0.5">
              {inline(it)}
            </li>
          ))}
        </Tag>,
      );
      list = null;
    };
    lines.forEach((raw) => {
      const line = raw.trimEnd();
      const ul = line.match(/^[-*]\s+(.*)$/);
      const ol = line.match(/^\d+\.\s+(.*)$/);
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (ul) {
        if (!list || list.ordered) flush();
        list ??= { ordered: false, items: [] };
        list.items.push(ul[1]);
      } else if (ol) {
        if (!list || !list.ordered) flush();
        list ??= { ordered: true, items: [] };
        list.items.push(ol[1]);
      } else if (h) {
        flush();
        nodes.push(
          <p key={`h${nodes.length}`} className="mt-4 mb-1 font-semibold">
            {inline(h[2])}
          </p>,
        );
      } else if (line.trim() === "") {
        flush();
      } else {
        flush();
        nodes.push(
          <p key={`p${nodes.length}`} className="mt-2 first:mt-0">
            {inline(line)}
          </p>,
        );
      }
    });
    flush();
  });

  return <>{nodes}</>;
}

/** Inline formatting: **bold**, *italic*, `code`. */
function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g);
  return parts.filter(Boolean).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {p.slice(2, -2)}
        </strong>
      );
    }
    if (p.length > 2 && p.startsWith("*") && p.endsWith("*")) {
      return (
        <em key={i}>{p.slice(1, -1)}</em>
      );
    }
    if (p.length > 2 && p.startsWith("`") && p.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[13px]"
        >
          {p.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
