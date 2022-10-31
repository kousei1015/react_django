import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import UpdatePost from "../features/post/UpdatePost";
import { MemoryRouter, Routes ,Route } from "react-router-dom";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

const handlers = [
  rest.get("http://localhost:8000/api/post/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        placeName: "国営昭和記念公園",
        description: "四季折々の花がみられる",
        accessStars: 5,
        congestionDegree: 4,
        img: null,
        userPost: {
          id: 2,
          profile: {
            id: 2,
            userProfile: 2,
            nickName: "User",
            img: null,
          },
        },
      })
    );
  }),
  rest.put("http://localhost:8000/api/post/:id", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 1,
        userPost: 1,
        placeName: "国営昭和記念公園 update",
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

describe("UpdatePost Component Test", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        post: postReducer,
      },
    });
  });
  it("1: Should render UpdatePostComponent successfully", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1/update"]}>
          <Routes>
            <Route path="/post/:id/update" element={<UpdatePost />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("btn-update")).toBeTruthy();
  });
  it("2: Should update successfully", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1/update"]}>
          <Routes>
            <Route path="/post/:id/update" element={<UpdatePost />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText("国営昭和記念公園")).toBeNull();
    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("btn-update"));
    expect(await screen.findByText("編集成功")).toBeInTheDocument();
    expect(await mockedNavigator).toBeCalledWith("/");
    expect(await mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should not route CoreComponent when status 400", async () => {
    server.use(
      rest.put("http://localhost:8000/api/post/:id", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1/update"]}>
          <Routes>
            <Route path="/post/:id/update" element={<UpdatePost />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    userEvent.click(screen.getByTestId("btn-update"));
    expect(await screen.findByText("エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください")).toBeInTheDocument();
    expect(await mockedNavigator).toHaveBeenCalledTimes(0);
  });
});
