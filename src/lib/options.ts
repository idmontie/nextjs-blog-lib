import { BlogOptions } from "./types";

/**
 * Default options for your blog.
 */
export const defaultOptions: BlogOptions = {
    /**
     * The directory where your blog posts are stored.
     */
    postsDirectory: "",
    rewriteMediaUrls: {
        /**
         * The directory where your media files that are found in markdown should get copied to.
         */
        mediaDirectory: "",
    },
    truncateMarker: "<!--truncate-->",
    truncateLength: 100,
    mdx: {
        components: {},
    },
};
