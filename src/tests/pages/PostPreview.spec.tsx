import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { createClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");
jest.mock("../../services/stripe");
jest.mock("next/router");

const post = {
  slug: "fake-slug",
  title: "Fake title 1",
  content: "<p>Fake excerpt 1</p>",
  updatedAt: "2020-01-01",
};

describe("Post Preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });
    render(<Post post={post} />);

    expect(screen.getByText("Fake title 1")).toBeInTheDocument();
    expect(screen.getByText("Fake excerpt 1")).toBeInTheDocument();
    expect(screen.getByText("Do you Wanna taste it?")).toBeInTheDocument();
  });

  it("redirects user to full post if subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const userRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
        activeSubscription: "fake-active-subscription",
      },

      status: "authenticated",
    });
    userRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/fake-slug");
  });

  it("loads inital data data", async () => {
    const getPrismicClientMocked = mocked(createClient);

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

    const response = await getStaticProps({
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
