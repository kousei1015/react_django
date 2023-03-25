import React from "react";
import { render, screen, cleanup, waitFor, queryByText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import PostDetail from "../features/post/PostDetail";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const token = "dummyToken";

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
            nickName: "myNickName",
            img: null,
          },
        },
      })
    );
  }),
  rest.delete("http://localhost:8000/api/post/1", (req, res, ctx) => {
    const Authorization = req.headers.get("Authorization");
    if (Authorization == `JWT dummyToken`) {
      return res(ctx.status(200));
    } else return res(ctx.status(401));
  }),
  rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
    const Authorization = req.headers.get("Authorization");
    if (Authorization == `JWT dummyToken`) {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 2,
            nickName: "myNickName",
            userProfile: 2,
            created_on: "2022-08-21T23:56:56.934652+09:00",
            img: null,
          },
        ])
      );
    } else {
      return res(ctx.status(401));
    }
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
          nickName: "other user",
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
    const Authorization = req.headers.get("Authorization");
    if (Authorization == `JWT dummyToken`) {
      return res(
        ctx.status(201),
        ctx.json({
          id: 2,
          text: "second comment",
          userComment: 2,
          post: 1,
        })
      );
    } else {
      return res(ctx.status(401));
    }
  }),
  rest.delete("http://localhost:8000/api/comment/2", (req, res, ctx) => {
    const Authorization = req.headers.get("Authorization");
    if (Authorization == `JWT dummyToken`) {
      return res(
        ctx.status(204),
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

describe("UpdatePost Component Test", () => {
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
  it("1: Should render UpdatePostComponent successfully", async () => {
    localStorage.setItem("localJWT", token);
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
    expect(screen.getByText("Post")).toBeTruthy();
    expect(screen.getByText("Edit")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });
  it("2: Should route to PostDetail Component successfully when edit button click", async () => {
    localStorage.setItem("localJWT", token);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    await user.click(screen.getByText("Edit"));
    expect(await mockedNavigator).toBeCalledWith("update");
    expect(await mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should delete post successfully and route to Core component when delete button click", async () => {
    localStorage.setItem("localJWT", token);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    await user.click(screen.getByText("Delete"));
    expect(await screen.findByText("削除成功")).toBeInTheDocument();
    expect(mockedNavigator).toBeCalledWith("/");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("4: Should add comment successfully", async () => {
    localStorage.setItem("localJWT", token);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    const commentInputValue = screen.getByPlaceholderText("add a comment");
    await user.type(commentInputValue, "second comment");
    await user.click(screen.getByText("Post"));
    expect(await screen.findByText("second comment")).toBeInTheDocument();
  });
  it("5: Should only show delete button to comment author", async () => {
    localStorage.setItem("localJWT", token);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    expect(screen.getByText("first comment")).toBeInTheDocument();
    expect(screen.queryByText("コメント削除")).not.toBeInTheDocument();
  });
  it("6: Should allow comment author to delete their comment", async () => {
    localStorage.setItem("localJWT", token);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    const commentInputValue = screen.getByPlaceholderText("add a comment");
    await user.type(commentInputValue, "second comment");
    await user.click(screen.getByText("Post"));
    expect(await screen.findByText("second comment")).toBeInTheDocument();
    expect(screen.queryByText("コメント削除")).toBeInTheDocument();
    await user.click(screen.queryByText("コメント削除"));
    await waitFor(() => expect(screen.queryByText("second comment")).not.toBeInTheDocument());
  });
  it("7: Should render PostDetailComponent elements successfully when unauthorized user", async () => {
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
    expect(screen.queryByText("first comment")).toBeNull();
    expect(await screen.findByText("Loading")).toBeTruthy();
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
  it("8: Should not add comment successfully when unauthorized user", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/1"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });
    expect(screen.getByText("コメントをするにはログインして下さい")
    ).toBeInTheDocument();
  });
});
