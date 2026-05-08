import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { PluggableList } from "unified";

// Allow basic markdown content while preventing script injection.
export const rehypePlugins: PluggableList = [
  [
    rehypeSanitize,
    {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        a: [
          ...(defaultSchema.attributes?.a ?? []),
          ["target", "_blank"],
          ["rel", "noopener noreferrer"]
        ]
      }
    }
  ]
];

