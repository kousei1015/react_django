import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import NewPost from "../features/post/NewPost";
import { MemoryRouter } from "react-router-dom";

const token = "dummyToken";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

const handlers = [
  rest.post("http://localhost:8000/api/post/", (req, res, ctx) => {
    const Authorization = req.headers.get("Authorization");
    if (Authorization == `JWT dummyToken`) {
      return res(
        ctx.status(200),
        ctx.json({
          id: 7,
          userPost: 1,
          placeName: "国営昭和記念公園",
          description:
            "四季折々の花がみられるのに加えて、夏には非常に広いプールも楽しめる",
          accessStars: 5,
          congestionDegree: 4,
          img: null,
          tags: [{ name: "test" }],
        })
      );
    } else {
      return res(ctx.status(401));
    }
  }),
];

const server = setupServer(...handlers);

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

describe("NewPost Component Test", () => {
  let store;
  beforeEach(() => {
    localStorage.clear();
    store = configureStore({
      reducer: {
        auth: authReducer,
        post: postReducer,
      },
    });
  });
  it("1: Should render NewPostComponent successfully", async () => {
    localStorage.setItem("localJWT", token);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewPost />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("btn-post")).toBeTruthy();
  });
  it("2: Should post successfully", async () => {
    localStorage.setItem("localJWT", token);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewPost />
        </MemoryRouter>
      </Provider>
    );
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
    const accessStar = expect(screen.getByText("5accessStars"));
    const congestionDegree = expect(screen.getByText("4congestionStars"));
    await user.click(accessStar.parentElement);
    await user.click(congestionDegree.parentElement);
    await user.click(screen.getByText("Post"));
    expect(await screen.findByText("投稿成功")).toBeInTheDocument();
    expect(mockedNavigator).toBeCalledWith("/");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should not route CoreComponent when status 400", async () => {
    localStorage.setItem("localJWT", token);
    server.use(
      rest.post("http://localhost:8000/api/post/", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewPost />
        </MemoryRouter>
      </Provider>
    );
    await user.click(screen.getByText("Post"));
    expect(
      await screen.findByText(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      )
    ).toBeInTheDocument();
    expect(await mockedNavigator).toHaveBeenCalledTimes(0);
  });
  it("4: Should not create new post when unauthorized user", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewPost />
        </MemoryRouter>
      </Provider>
    );
    await user.click(screen.getByText("Post"));
    expect(
      await screen.findByText(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      )
    ).toBeInTheDocument();
  });
});
