import { NewPostData } from "./testData/postData";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import NewPost from "../pages/NewPost";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useAddPost } from "../hooks/useQueryHooks";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

jest.mock("../hooks/useQueryHooks", () => ({
  ...jest.requireActual("../hooks/useQueryHooks"),
  useAddPost: jest.fn(),
}));

const handlers = [
  rest.post("http://localhost:8000/api/post/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(NewPostData));
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
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

const user = userEvent.setup();

const renderNewPost = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <NewPost />
    </QueryClientProvider>
  );
};

describe("NewPost Component Test", () => {
  it("1: Should render NewPostComponent successfully", async () => {
    const mockMutateAsync = jest.fn();
    useAddPost.mockReturnValue({ mutateAsync: mockMutateAsync });
    renderNewPost();

    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("btn-post")).toBeTruthy();
  });
  it("2: Should post successfully", async () => {
    const mockMutateAsync = jest.fn();
    useAddPost.mockReturnValue({ mutateAsync: mockMutateAsync });
    renderNewPost();

    const placeNameInput = screen.getByPlaceholderText(
      "お気に入りの場所の名前を入力してください※入力必須 30文字まで"
    );
    const descriptionInput = screen.getByPlaceholderText(
      "その場所の説明を入力してください※入力必須 200文字まで"
    );
    await user.type(placeNameInput, "国営昭和記念公園");
    await user.type(
      descriptionInput,
      "四季折々の花がみられるのに加えて、夏には非常に広いプールも楽しめる"
    );
    const accessStar = screen.getByTestId("5accessStars");
    const congestionDegree = screen.getByTestId("4congestionStars");
    await user.click(accessStar.parentElement);
    await user.click(congestionDegree.parentElement);
    await user.click(screen.getByText("Post"));
    expect(await screen.findByText("投稿成功")).toBeInTheDocument();
    expect(mockedNavigator).toBeCalledWith("/");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should not route CoreComponent when status 400", async () => {
    server.use(
      rest.post("http://localhost:8000/api/post/", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    renderNewPost();

    await user.click(screen.getByText("Post"));
    expect(
      await screen.findByText(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      )
    ).toBeInTheDocument();
    expect(await mockedNavigator).toHaveBeenCalledTimes(0);
  });
  it("4: Should not create new post when unauthorized user", async () => {
    renderNewPost();

    await user.click(screen.getByText("Post"));
    expect(
      await screen.findByText(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      )
    ).toBeInTheDocument();
  });
});
