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

## Using @mdx-js/mdx

Since `@mdx-js/mdx` is an ESM package, I left it out of this package. Install it in your consuming project and use it like so:

```ts
export const compiler = async (mdx: string) => {
    const inter = String(
        await compile(mdx, {
            outputFormat: "function-body",
            useDynamicImport: true,
        })
    );
    return inter.replaceAll("jsxDEV", "jsx");
};

export const runner = async (code: string) => {
    const scope = {};

    const { default: Component } = await run(code, {
        ...runtime,
        scope,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Component;
};

const blogOptions: Partial<BlogOptions> = {
    mdx: {
        compile: compiler,
        run: runner,
    },
};
```

This also gives you flexibility to use other plugins with `@mdx-js/mdx`.

## Docs

See the docs on our [Github page](https://idmontie.github.io/nextjs-blog-lib).

## License

MIT License. See [LICENSE](LICENSE) for more information.
