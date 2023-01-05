import fs from "fs";
import { join } from "path";

import React from "react";
import ReactDOMServer from "react-dom/server";

import { BlogOptions } from "./types";

/**
 * Rewrite all media images to public folder paths
 *
 * @ignore
 */
export function rewriteMedias(
    baseFilePath: string,
    scope: string,
    markdown: string,
    mediaDirectory: string
) {
    const mediaPaths: {
        referencePath: string;
        oldAbsolutePath: string;
        newPath: string;
    }[] = [];

    // Match images like `![alt](/path)` or `![alt](./path)`
    const regex = /!\[.*]\((\.\/|\/)(.*)\)/gm;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(markdown)) !== null) {
        const prefix = match[1];
        const mediaPath = match[2];

        mediaPaths.push({
            referencePath: mediaPath,
            oldAbsolutePath: join(baseFilePath, mediaPath),
            newPath: join(scope, mediaPath),
        });

        markdown = markdown.replace(
            `${prefix}${mediaPath}`,
            join(scope, mediaPath)
        );
    }

    // Copy all media files to public folder
    for (const mediaPath of mediaPaths) {
        // Ensure the media scope folder exists
        const scopePath = join(mediaDirectory, scope);
        if (!fs.existsSync(scopePath)) {
            fs.mkdirSync(scopePath, { recursive: true });
        }

        const { oldAbsolutePath, newPath } = mediaPath;

        fs.copyFileSync(oldAbsolutePath, join(mediaDirectory, newPath));
    }

    return markdown;
}

/**
 * @ignore
 */
export function createExcerpt(content: string, options: BlogOptions) {
    const truncateIndex = content.indexOf(options.truncateMarker);

    if (truncateIndex !== -1) {
        return content.slice(0, truncateIndex);
    }

    // Find the first paragraph
    const firstParagraphIndex = content.match(/(.+)\n/gm)?.[0].length;

    if (firstParagraphIndex !== -1) {
        return content.slice(0, firstParagraphIndex);
    }

    return content.slice(0, options.truncateLength);
}

/**
 * Create a HTML string from a markdown string, and
 * support MDX syntax with imports. This is used to
 * generate server-side rendered HTML for blog posts.
 *
 * @ignore
 */
export async function createHtmlStringFromMarkdown(
    markdown: string,
    options: BlogOptions
) {
    // Replace <!--.*--> with empty string
    markdown = markdown.replace(/<!--.*-->/g, "");

    const code = await options.mdx.compile(markdown);
    const Component = await toJsx(code, options);

    const rendered = String(
        ReactDOMServer.renderToString(
            <Component components={options.mdx.components} />
        )
    );

    return {
        rendered,
        code,
    };
}

/**
 * @ignore
 */
async function toJsx(code: string, options: BlogOptions) {

    return options.mdx.run(code);

}
