import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { createClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");
jest.mock("../../services/stripe");

const post = {
  slug: "fake-slug",
  title: "Fake title 1",
  content: "<p>Fake excerpt 1</p>",
  updatedAt: "2020-01-01",
};

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("Fake title 1")).toBeInTheDocument();
    expect(screen.getByText("Fake excerpt 1")).toBeInTheDocument();
  });

  it("redirects user if no subscription found", async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);
    const response = await getServerSideProps({
      params: { slug: "fake-slug" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      }),
    );
  });

  it("loads inital data data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(createClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: "my-new-post", // Adicionar o mesmo UID
        data: {
          Title: [{ type: "heading", text: "My new post" }],
          Content: [{ type: "paragraph", text: "Post content" }],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: [{ type: "heading", text: "My new post" }],
            content: "<p>Post content</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      }),
    );
  });
});
