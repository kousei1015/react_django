import { PostDetailData } from "./testData/postData";
import { myProfileData } from "./testData/profileData";
import {
  addedCommentData,
  commentData,
  newCommentData,
} from "./testData/commentData";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import PostDetail from "../pages/PostDetail";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useDeletePost,
  useAddComment,
  useDeleteComment,
} from "../hooks/useQueryHooks";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

jest.mock("../hooks/useQueryHooks", () => ({
  ...jest.requireActual("../hooks/useQueryHooks"),
  useDeletePost: jest.fn(),
  useAddComment: jest.fn(),
  useDeleteComment: jest.fn(),
}));

const handlers = [
  rest.get("http://localhost:8000/api/post/1", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(PostDetailData));
  }),
  rest.delete("http://localhost:8000/api/post/1", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(myProfileData));
  }),
  rest.get("http://localhost:8000/api/comment/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(commentData));
  }),
  rest.post("http://localhost:8000/api/comment/", (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(newCommentData));
  }),
  rest.delete("http://localhost:8000/api/comment/2", (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];

const server = setupServer(...handlers);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  queryClient.clear();
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

const user = userEvent.setup();

const renderPost = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/post/1"]}>
        <Routes>
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("PostDetail Component Test", () => {
  it("1: Should render UpdatePostComponent successfully", async () => {
    renderPost();

    expect(screen.queryByText("国営昭和記念公園")).toBeNull();
    expect(screen.queryByText("myNickName")).toBeNull();
    expect(screen.queryByText("first comment")).toBeNull();
    expect(await screen.findByText("Loading")).toBeTruthy();
    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    expect(screen.getByText("myNickName")).toBeInTheDocument();
    expect(screen.getByText("first comment")).toBeInTheDocument();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("place-name")).toBeTruthy();
    expect(screen.getByTestId("description")).toBeTruthy();
    expect(screen.getByTestId("tag-name")).toBeTruthy();
    expect(screen.getByTestId("post")).toBeTruthy();
    expect(screen.getByTestId("edit")).toBeTruthy();
    expect(screen.getByTestId("delete")).toBeTruthy();
  });
  it("2: Should route to PostDetail Component successfully when edit button click", async () => {
    renderPost();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    await user.click(screen.getByText("編集"));
    expect(mockedNavigator).toBeCalledWith("update");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should delete post successfully and route to Core component when delete button click", async () => {
    const mockMutate = jest.fn();
    useDeletePost.mockReturnValue({ mutate: mockMutate });
    renderPost();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    await user.click(screen.getByText("削除"));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: 1,
      });
    });
    expect(await screen.findByText("削除成功")).toBeInTheDocument();
    expect(mockedNavigator).toBeCalledWith("/");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("4: Should add comment successfully", async () => {
    const mockMutateAsync = jest.fn();
    useAddComment.mockReturnValue({ mutateAsync: mockMutateAsync });
    renderPost();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    const commentInputValue = screen.getByPlaceholderText("add a comment");
    await user.type(commentInputValue, "second comment");
    await user.click(screen.getByText("Post"));
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        text: "second comment",
        post: 1,
      });
    });
  });
  it("5: Should only show delete button to comment author", async () => {
    server.use(
      rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );
    renderPost();

    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    expect(screen.getByText("first comment")).toBeInTheDocument();
    expect(screen.queryByText("コメント削除")).not.toBeInTheDocument();
  });
  it("6: Should render PostDetailComponent elements successfully when unauthorized user", async () => {
    server.use(
      rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );
    renderPost();

    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    expect(screen.getByText("first comment")).toBeInTheDocument();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("place-name")).toBeTruthy();
    expect(screen.getByTestId("description")).toBeTruthy();
    expect(screen.getByTestId("tag-name")).toBeTruthy();
    expect(screen.queryByText("Post")).toBeNull();
    expect(screen.queryByText("Edit")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
  });
  it("7: Should not add comment successfully when unauthorized user", async () => {
    server.use(
      rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
        return res.once(ctx.status(401));
      })
    );
    renderPost();

    expect(
      await screen.findByText("コメントをするにはログインして下さい")
    ).toBeInTheDocument();
  });
  it("8: Should delete comment successfully when request user is the poster", async () => {
    server.use(
      rest.get("http://localhost:8000/api/comment/", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(addedCommentData));
      })
    );
    const mockMutateAsync = jest.fn(); // モック関数の作成
    useDeleteComment.mockReturnValue({ mutateAsync: mockMutateAsync });
    renderPost();

    expect(await screen.findByText("first comment")).toBeInTheDocument();
    expect(screen.getByText("コメント削除")).toBeInTheDocument();
    await user.click(screen.queryByText("コメント削除"));
    expect(mockMutateAsync).toHaveBeenCalledWith({ id: 2 });
  });
});
