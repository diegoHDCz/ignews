import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps, Post } from "../../pages/posts";
import { createClient } from "../../services/prismic";

jest.mock("../../services/stripe");

const posts = [
  {
    slug: "fake-slug",
    title: "Fake title 1",
    excerpt: "Fake excerpt 1",
    updated_at: "2020-01-01",
  },
] as Post[];

jest.mock("../../services/prismic");

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("Fake title 1")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(createClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
        {
          uid: "fake-slug",
          data: {
            title: "Fake title 1",
            Content: [
              {
                type: "paragraph",
                text: "Fake excerpt 1",
              },
            ],
          },
          last_publication_date: "2020-01-01",
        },
      ]),
    } as any);

    const response = await getStaticProps({
      previewData: undefined,
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "fake-slug",
              excerpt: "Fake excerpt 1",
              updated_at: "31 de dezembro de 2019",
            },
          ],
        },
      }),
    );
  });
});
