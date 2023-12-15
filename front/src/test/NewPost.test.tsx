import { NewPostData } from "./testData/postData";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import NewPost from "../pages/NewPost";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { vi } from "vitest";

const mockedNavigator = vi.fn();
const mockMutateAsync = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual("react-router-dom")) as any;
  return {
    ...actual,
    useNavigate: () => mockedNavigator,
  };
});

vi.mock("../hooks/useQueryHooks", async () => {
  const actual = (await vi.importActual("../hooks/useQueryHooks")) as any;
  return {
    ...actual,
    useAddPost: vi.fn().mockImplementation(() => {
      return {
        mutateAsync: mockMutateAsync,
      };
    }),
  };
});

const handlers = [
  rest.post("http://localhost:8000/api/post/", (_, res, ctx) => {
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
  vi.clearAllMocks();
  queryClient.clear();
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
    renderNewPost();

    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("btn-post")).toBeTruthy();
  });
  it("2: Should post successfully", async () => {
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
    await user.click(accessStar!.parentElement!);
    await user.click(congestionDegree!.parentElement!);
    await user.click(screen.getByText("Post"));
    expect(await screen.findByText("投稿成功")).toBeInTheDocument();
    expect(mockedNavigator).toBeCalledWith("/");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should not route CoreComponent when status 400", async () => {
    mockMutateAsync.mockRejectedValue({ "error": 400 });
    renderNewPost();
    await user.click(screen.getByText("Post"));
    expect(
      await screen.findByText(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      )
    ).toBeInTheDocument();
    expect(mockedNavigator).toBeCalledTimes(0);
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
