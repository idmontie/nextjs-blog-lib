import fs from "fs";
import { join } from "path";

import matter from "gray-matter";

import {
    createExcerpt,
    createHtmlStringFromMarkdown,
    rewriteMedias,
} from "./content";
import { BlogOptions, Post } from "./types";
import { memoize } from "./util";

/**
 * Get a post by its slug.
 *
 * @param slug
 * @param options
 */
export const getPostBySlug = memoize(async function (
    slug: string,
    options: BlogOptions
): Promise<Post> {
    const folderPath = join(options.postsDirectory, slug);
    const fullPath = join(folderPath, "index.mdx");
    const backupPath = join(folderPath, "index.md");

    let filePath;

    // Check if path is a folder or a file
    if (fs.lstatSync(folderPath).isFile()) {
        filePath = folderPath;
    } else if (fs.existsSync(fullPath)) {
        filePath = fullPath;
    } else {
        filePath = backupPath;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");

    const newContents = options.rewriteMediaUrls
        ? rewriteMedias(
              folderPath,
              slug,
              fileContents,
              options.rewriteMediaUrls.mediaDirectory,
              options.rewriteMediaUrls.relativeDirectory
          )
        : fileContents;

    const { data, content } = matter(newContents);
    const excerpt = createExcerpt(content, options);

    const { rendered: excerptRendered, code: excerptCode } =
        await createHtmlStringFromMarkdown(excerpt || "", options);

    const { rendered: contentRendered, code: contentCode } =
        await createHtmlStringFromMarkdown(content || "", options);

    const item: Post = {
        slug: slug,
        date: slug.split("-").slice(0, 3).join("-"),
        title: data["title"] ?? slug,
        frontmatter: data,
        contentRaw: content,
        contentHTML: contentRendered,
        contentCode,
        excerptRaw: excerpt,
        excerptHTML: excerptRendered,
        excerptCode,
    };

    return item;
});

/**
 * Get a list of all post slugs.
 */
export function getPostSlugs(options: BlogOptions) {
    return fs.readdirSync(options.postsDirectory);
}

/**
 * Get a list of all posts.
 */
export const getAllPosts = memoize(async function (options: BlogOptions) {
    const slugs = getPostSlugs(options);
    return await Promise.all(slugs.map((slug) => getPostBySlug(slug, options)));
});

export async function getAllPostsByDate(options: BlogOptions) {
    const result = await getAllPosts(options);
    return result.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

export async function getNextPost(slug: string, options: BlogOptions) {
    const allPosts = await getAllPostsByDate(options);

    const index = allPosts.map((post) => post.slug).indexOf(slug);

    if (index === allPosts.length - 1 || index === -1) return null;

    return allPosts[index + 1];
}

export async function getPreviousPost(slug: string, options: BlogOptions) {
    const allPosts = await getAllPostsByDate(options);

    const index = allPosts.map((post) => post.slug).indexOf(slug);

    if (index === 0 || index === -1) return null;

    return allPosts[index - 1];
}
