import { defaultOptions } from './options';
import {
  getAllPostsByDate,
  getNextPost,
  getPostBySlug,
  getPreviousPost,
} from './posts';
import { BlogOptions } from './types';

/**
 * Create a blog instance with the given options.
 *
 * @param options
 * @returns blog instance
 */
export function createBlog(options: Partial<BlogOptions> = {}) {
  const opts = { ...defaultOptions, ...options };

  return {
    getPostBySlug: async (slug: string) => {
      const post = await getPostBySlug(slug, opts);

      const previous = await getPreviousPost(slug, opts);

      const next = await getNextPost(slug, opts);

      return {
        post,
        previous,
        next,
      };
    },
    getAllPostsByDate: () => getAllPostsByDate(opts),
  };
}
