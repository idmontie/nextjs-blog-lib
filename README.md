# nextjs-blog-lib

NextJS library to create blogs

## Usage

Install with npm:

```bash
npm install nextjs-blog-lib
```

Create a blog instance:

```ts

import type { BlogOptions } from 'nextjs-blog-lib';
import { createBlog } from 'nextjs-blog-lib';

const blogOptions: Partial<BlogOptions> = {
    // Override default options
};

export const blog = createBlog(blogOptions);
```

Use the blog instance on a page:

```ts
export const getStaticProps: GetStaticProps = async () => {
    const posts = await blog.getAllPostsByDate();

    return {
        props: {
            posts,
        },
    };
};
```

## Docs

See the docs on our [Github page](https://idmontie.github.io/nextjs-blog-lib).

## License

MIT License. See [LICENSE](LICENSE) for more information.
