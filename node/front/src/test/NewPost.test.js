import React from "react";
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import postReducer from "../features/post/postSlice";
import NewPost from "../features/post/NewPost";
import { BrowserRouter} from "react-router-dom";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

const handlers = [
  rest.post("http://localhost:8000/api/post/", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 7,
        userPost: 1,
        placeName: "国営昭和記念公園",
        description:
          "四季折々の花がみられるのに加えて、夏には非常に広いプールも楽しめる",
        accessStars: 5,
        congestionDegree: 4,
        img: null,
      })
    );
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

describe("NewPost Component Test", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        post: postReducer,
      },
    });
  });
  it("1: Should render NewPostComponent successfully", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NewPost />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("btn-post")).toBeTruthy();
  });
  it("2: Should post successfully", async () => {
    const newPost = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NewPost onClick={newPost} />
        </BrowserRouter>
      </Provider>
    );
    await userEvent.click(screen.getByText("Post"));
    expect(await screen.findByText("投稿成功")).toBeInTheDocument();
    expect(await mockedNavigator).toBeCalledWith('/');
    expect(await mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should not route CoreComponent when status 400", async ()  => {
    server.use(
      rest.post("http://localhost:8000/api/post/", (req, res, ctx) => {
        return res(ctx.status(400))
      })
    );
    const newPost = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NewPost onClick={newPost} />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText("Post"));
    expect(await screen.findByText("エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください")).toBeInTheDocument();
    expect(await mockedNavigator).toHaveBeenCalledTimes(0);
  })
});
