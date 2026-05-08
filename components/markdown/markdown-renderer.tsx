import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypePlugins } from "@/lib/markdown";
import { cn } from "@/lib/utils";

export function MarkdownRenderer({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div className={cn("prose prose-neutral max-w-none dark:prose-invert", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={rehypePlugins}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

