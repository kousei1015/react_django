import React from "react";
import { waitFor } from "@testing-library/react";
import { render, screen, cleanup, } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import PostDetail from "../features/post/PostDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

const handlers = [
  rest.get("http://localhost:8000/api/post/1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        placeName: "国営昭和記念公園",
        description: "四季折々の花がみられる",
        accessStars: 5,
        congestionDegree: 4,
        img: null,
        tags: [{name: "tag"}],
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
  rest.delete("http://localhost:8000/api/post/1", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 2,
          userProfile: 2,
          nickName: "myNickName",
          created_on: "2022-09-11T10:12:08.292635+09:00",
          img: null,
        },
      ])
    );
  }),
  rest.get("http://localhost:8000/api/profile", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 2,
          userProfile: 2,
          nickName: "myNickName",
          created_on: "2022-09-11T10:12:08.292635+09:00",
          img: null,
        },
        {
          id: 3,
          userProfile: 3,
          nickName: "myNickName2",
          created_on: "2022-09-11T10:12:08.292635+09:00",
          img: null,
        },
      ])
    );
  }),
  rest.get("http://localhost:8000/api/comment/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          text: "first comment",
          userComment: 1,
          post: 1,
        },
      ])
    );
  }),
  rest.post("http://localhost:8000/api/comment/", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        text: "second comment",
        userComment: 2,
        post: 1,
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
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.findByText("Loading")).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId("access")).toBeTruthy());
    expect(screen.getByTestId("access")).toBeTruthy();
    expect(screen.getByTestId("congestion")).toBeTruthy();
    expect(screen.getByTestId("place-name")).toBeTruthy();
    expect(screen.getByTestId("description")).toBeTruthy();
    expect(screen.getByTestId("tag-name")).toBeTruthy();
    expect(screen.getByText("Edit")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });
  it("2: Should route to UpdatePost Component successfully when edit button click", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText("国営昭和記念公園")).toBeNull();
    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    expect(await screen.findByText("myNickName")).toBeInTheDocument();
    expect(await screen.findByText("first comment")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Edit"));
    expect(await mockedNavigator).toBeCalledWith("update");
    expect(await mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should delete post successfully and route to Core component when delete button click", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText("国営昭和記念公園")).toBeNull();
    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    expect(await screen.findByText("myNickName")).toBeInTheDocument();
    expect(await screen.findByText("first comment")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Delete"));
    expect(await screen.findByText("削除成功")).toBeInTheDocument();
    expect(await mockedNavigator).toBeCalledWith("/");
    expect(await mockedNavigator).toBeCalledTimes(1);
  });
  it("4: Should add comment successfully", async () => {
    const postComment = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.findByText("Loading")).toBeTruthy();
    await waitFor(() => expect(screen.getByText("国営昭和記念公園")).toBeInTheDocument());
    expect(await screen.findByText("国営昭和記念公園")).toBeInTheDocument();
    expect(await screen.findByText("myNickName")).toBeInTheDocument();
    expect(await screen.findByText("first comment")).toBeInTheDocument();
    const commentInputValue = screen.getByPlaceholderText("add a comment");
    await userEvent.type(commentInputValue, "second comment");
    await waitFor(() => expect(screen.getByTestId("post")).not.toBeDisabled());
    await userEvent.click(screen.getByText("Post"));
    expect(await screen.findByText("second comment")).toBeInTheDocument();
  });
});
