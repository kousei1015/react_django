import React from "react";
import { PostDetailData } from "../postData";
import { myProfileData, profileData } from "../profileData";
import { commentData, newCommentData } from "../commentData";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
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
      ctx.json(PostDetailData)
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
        ctx.json(myProfileData)
      );
    } else {
      return res(ctx.status(401));
    }
  }),
  rest.get("http://localhost:8000/api/comment/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(commentData)
    );
  }),
  rest.post("http://localhost:8000/api/comment/", (req, res, ctx) => {
    const Authorization = req.headers.get("Authorization");
    if (Authorization == `JWT dummyToken`) {
      return res(
        ctx.status(201),
        ctx.json(newCommentData)
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
    expect(screen.getByTestId("post")).toBeTruthy();
    expect(screen.getByTestId("edit")).toBeTruthy();
    expect(screen.getByTestId("delete")).toBeTruthy();
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
    await user.click(screen.getByText("編集"));
    expect(mockedNavigator).toBeCalledWith("update");
    expect(mockedNavigator).toBeCalledTimes(1);
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
    await user.click(screen.getByText("削除"));
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
