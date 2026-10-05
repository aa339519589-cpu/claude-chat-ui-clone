import { SparkIcon } from "./icons";

/**
 * First-chat greeting — measured from the live page:
 * h2 anthropic-serif 22px/27.5px w600; paragraphs 16px/24px, 8px top margin;
 * spark 32×32 clay, 40px below the text.
 */
export function Greeting({ name }: { name: string }) {
  return (
    <div className="pl-2 font-serif text-primary">
      <h2 className="text-[22px] leading-[27.5px] font-semibold">
        Welcome, {name}! I&rsquo;m Claude.
      </h2>
      <p className="mt-2 text-base leading-6 font-normal">
        Bring me anything—a tough problem, a half-formed idea, something you
        need to write. We&rsquo;ll figure it out together.
      </p>
      <p className="mt-2 text-base leading-6 font-normal">
        Where do you want to start?
      </p>
      <div className="mt-10 pl-1">
        <SparkIcon className="size-8 text-clay" />
      </div>
    </div>
  );
}
