import { PostDetailData, updatePostData } from "./testData/postData";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import UpdatePost from "../pages/UpdatePost";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

const mockedNavigator = vi.fn();
const mockMutateAsync = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual("react-router-dom")) as any;
  return {
    ...actual,
    useNavigate: () => mockedNavigator,
    useParams: () => ({
      id: 1
    })
  };
});

vi.mock('../hooks/useQueryHooks', async () => {
  const actual = (await vi.importActual("../hooks/useQueryHooks")) as any;
  return {
    ...actual,
    useUpdatePost: vi.fn().mockImplementation(() => {
      return {
        mutateAsync: mockMutateAsync
      }
    }),
  }
})

const handlers = [
  rest.get("http://localhost:8000/api/post/:id", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(PostDetailData));
  }),
  rest.put("http://localhost:8000/api/post/:id", (_, res, ctx) => {
    return res(ctx.status(201), ctx.json(updatePostData));
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

const renderUpdatePost = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/post/1/update"]}>
        <Routes>
          <Route path="/post/1/update" element={<UpdatePost />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("UpdatePost Component Test", () => {
  it("1: Should render UpdatePostComponent successfully", async () => {
    renderUpdatePost();

    expect(screen.queryByText("国営昭和記念公園")).toBeNull();
    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    expect(screen.getByText("四季折々の花がみられる")).toBeInTheDocument();
    expect(screen.getByText("花")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("btn-update")).toBeTruthy();
  });
  it("2: Should update successfully", async () => {
    renderUpdatePost();
    
    await waitFor(() =>
      expect(screen.getByText("国営昭和記念公園")).toBeInTheDocument()
    );
    await user.click(screen.getByText("Edit"));
    console.log(mockMutateAsync.getMockImplementation)
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 1,
        placeName: "国営昭和記念公園",
        description: "四季折々の花がみられる",
        img: null,
        accessStars: "5",
        congestionDegree: "4",
        tags: [{ name: "花" }],
      });
    });
    expect(await screen.findByText("編集成功")).toBeInTheDocument();
    expect(mockedNavigator).toBeCalledWith("/");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should not route CoreComponent when status is 400", async () => {
    mockMutateAsync.mockRejectedValue({"error": 400})
    renderUpdatePost();

    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    await user.click(screen.getByTestId("btn-update"));
    expect(
      await screen.findByText(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      )
    ).toBeInTheDocument();
    expect(mockedNavigator).toHaveBeenCalledTimes(0);
  });
});
