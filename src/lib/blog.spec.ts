import { createBlog } from "./blog";

describe("createBlog", () => {
    it("should return a blog object", async () => {
        const blog = createBlog({
            postsDirectory: "src/lib/__fixtures__/posts",
            mdx: {
                components: {},
                compile: async function () {
                    return "";
                },
                run: async function () {
                    return () => null;
                },
            },
        });

        const posts = await blog.getAllPostsByDate();

        expect(posts).toHaveLength(2);
    });
});
