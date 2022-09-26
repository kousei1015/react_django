import React from "react";
import {
  render,
  screen,
  cleanup,
  waitFor,
  findByText,
  findByTestId,
  findByPlaceholderText,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/post/postSlice";
import authReducer from "../features/auth/authSlice";
import Core from "../features/core/Core";
import { BrowserRouter } from "react-router-dom";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

const handlers = [
  rest.post("http://localhost:8000/authen/jwt/create/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ refresh: "aaa123", access: "abc123" })
    );
  }),
  rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          nickName: "test user",
          userPost: 1,
          created_on: "2022-08-21T23:56:56.934652+09:00",
          img: null,
        },
      ])
    );
  }),
  rest.put("http://localhost:8000/api/profile/1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        {
          id: 1,
          nickName: "test user update",
          userPost: 1,
          created_on: "2022-08-21T23:56:56.934652+09:00",
          img: null,
        },
      )
    );
  }),
  rest.get("http://localhost:8000/api/post/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          userPost: 2,
          placeName: "test",
          description: "test",
          accessStars: 3,
          congestionDegree: 3,
          img: "http://localhost:8000/media/posts/2test.jpg",
        },
        {
          id: 2,
          userPost: 1,
          placeName: "大國魂神社",
          description: "東京都の指定文化財",
          accessStars: 4,
          congestionDegree: 4,
          img: "http://localhost:8000/media/posts/1%E5%A4%A7%E5%9C%8B%E9%AD%82%E7%A5%9E%E7%A4%BE.jpg",
        },
      ])
    );
  }),
  rest.get("http://localhost:8000/api/profile/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          nickName: "User",
          userPost: 1,
          created_on: "2022-08-21T23:56:56.934652+09:00",
          img: null,
        },
        {
          id: 2,
          nickName: "User",
          userPost: 2,
          created_on: "2022-08-21T23:56:56.934652+09:30",
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
          text: "comment test",
          userComment: 1,
          post: 2,
        },
        { id: 2, text: "comment test2", userComment: 2, post: 2 },
      ])
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

describe("Core Component Test", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        post: postReducer,
      },
    });
  });
  it("1: Should render all the elements", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Core />
        </BrowserRouter>
      </Provider>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
    await userEvent.type(screen.getByLabelText(/password/i), "aaaa");

    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await userEvent.click(
      screen.getByTestId("submit-button", { name: /submit/i })
    );
    await waitFor(() =>
      expect(screen.getByTestId("btn-logout")).toBeInTheDocument()
    );
  });
  it("2: Should render detail page", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Core />
        </BrowserRouter>
      </Provider>
    );
    await userEvent.click(screen.getByText("LogIn"));
    await userEvent.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
    await userEvent.type(screen.getByLabelText(/password/i), "aaaa");

    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await userEvent.click(
      screen.getByTestId("submit-button", { name: /submit/i })
    );
    await waitFor(() => expect(screen.getByText("Logout")).toBeInTheDocument());
    await userEvent.click(screen.getByTestId(`detail-1`));
    expect(await mockedNavigator).toBeCalledWith("/post/1");
    expect(await mockedNavigator).toBeCalledTimes(1);
  });
  it("3: Should put myprofile successfully", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Core />
        </BrowserRouter>
      </Provider>
    );
    await userEvent.click(screen.getByText("LogIn"));
    await userEvent.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
    await userEvent.type(screen.getByLabelText(/password/i), "aaaa");

    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await userEvent.click(
      screen.getByTestId("submit-button", { name: /submit/i })
    );
    await waitFor(() => expect(screen.getByText("Logout")).toBeInTheDocument());
    await userEvent.click(screen.getByTestId("edit-modal"));
    expect(await screen.findByText("Update")).toBeInTheDocument();
    const inputValue = screen.getByPlaceholderText("nickname");
    userEvent.type(inputValue, "test user update");
    await userEvent.click(screen.getByText("Update"));
    expect(await screen.findByText("test user update"))
  });
});
