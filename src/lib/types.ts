export interface BlogOptions {
    postsDirectory: string;
    rewriteMediaUrls:
        | false
        | {
              mediaDirectory: string;
              relativeDirectory: string;
          };
    truncateMarker: string;
    truncateLength: number;
    mdx: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components: Record<string, any>;
        compile: (mdx: string) => Promise<string>;
        run: (code: string) => Promise<MdxRenderType>;
    };
}

export interface Post {
    title: string;
    date: string;
    slug: string;
    frontmatter: Record<string, unknown>;
    contentRaw: string;
    contentHTML: string;
    contentCode: string;
    excerptRaw: string;
    excerptHTML: string;
    excerptCode: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MdxRenderType = React.FC<{ components: Record<string, any> }>;
