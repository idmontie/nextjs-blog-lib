import { createBlog } from "./blog";

// Mock mdx-js, its an esm module and jest doesn't support esm modules
jest.mock("@mdx-js/mdx", () => ({
    compile: function () {
        return "";
    },
    run: function () {
        return {
            default: function () {
                return null;
            },
        };
    },
}));

describe("createBlog", () => {
    it("should return a blog object", async () => {
        const blog = createBlog({
            postsDirectory: "src/lib/__fixtures__/posts",
        });

        const posts = await blog.getAllPostsByDate();

        expect(posts).toHaveLength(2);
    });
});
