import React from "react";
import { postData, postData2 } from "../postData";
import { profileData, updateProfileData, myProfileData } from "../profileData";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/post/postSlice";
import authReducer from "../features/auth/authSlice";
import Core from "../features/core/Core";
import { MemoryRouter } from "react-router-dom";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

const token = { refresh: "dummyToken", access: "dummyToken" };

const handlers = [
  rest.post("http://localhost:8000/api/register/", (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.post("http://localhost:8000/authen/jwt/create/", (req, res, ctx) => {
    localStorage.setItem("localJWT", token.access);
    return res(ctx.status(200), ctx.json(token));
  }),
  rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
    const Authorization = req.headers.get("Authorization");
    if (Authorization == `JWT dummyToken`) {
      return res(ctx.status(200), ctx.json(myProfileData));
    } else {
      return res(ctx.status(401));
    }
  }),
  rest.put("http://localhost:8000/api/profile/2", (req, res, ctx) => {
    const Authorization = req.headers.get("Authorization");
    if (!Authorization) {
      return res(ctx.status(401));
    } else if (Authorization == `JWT dummyToken`) {
      return res(ctx.status(200), ctx.json(updateProfileData));
    }
  }),
  rest.get("http://localhost:8000/api/post/", (req, res, ctx) => {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    if (page === "1") {
      return res(ctx.status(200), ctx.json(postData));
    } else if (page === "2") {
      return res(ctx.status(200), ctx.json(postData2));
    }
  }),
  rest.get("http://localhost:8000/api/profile/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(profileData));
  }),
  rest.post("http://localhost:8000/api/profile/", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        nickName: "myNickName",
        userPost: 2,
        img: null,
      })
    );
  }),
];

const server = setupServer(...handlers);

const user = userEvent.setup();

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
    localStorage.clear();
    store = configureStore({
      reducer: {
        auth: authReducer,
        post: postReducer,
      },
    });
  });
  it("1: Should regsiter all elements when login successfully", async () => {
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    root.setAttribute("data-testid", "app-element");
    document.body.appendChild(root);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Core />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    );
    await user.type(screen.getByLabelText(/email/i), "duymmy@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "dddd");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);
    await waitFor(() =>
      expect(localStorage.getItem("localJWT")).toBe("dummyToken")
    );
    await waitFor(() =>
      expect(screen.queryByText("Login")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Map Collection")).toBeInTheDocument();
    expect(screen.getByText("ログアウト")).toBeInTheDocument();
    expect(screen.getByText("新規投稿")).toBeInTheDocument();
    expect(await screen.findByText("東京タワー")).toBeInTheDocument();
    expect(screen.getByTestId("myNickName").textContent).toBe("myNickName");
    expect(screen.getAllByText("other user").length).toBeGreaterThan(1);
    expect(screen.getAllByText("絶景スポット").length).toBeGreaterThan(1);
    expect(screen.getAllByText("詳細")).toHaveLength(12);
  });
  it("2: Should regsiter all elements when login successfully", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Core />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    );
    await user.click(screen.getByText("新規登録はこちら"));
    expect(await screen.findByText("Register"));
    await user.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "dddd");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);
    await waitFor(() => expect(submitButton).not.toBeInTheDocument());
    await waitFor(() =>
      expect(localStorage.getItem("localJWT")).toBe("dummyToken")
    );
    expect(screen.getByText("Map Collection")).toBeInTheDocument();
    expect(screen.getByText("ログアウト")).toBeInTheDocument();
    expect(screen.getByText("新規投稿")).toBeInTheDocument();
    expect(await screen.findByText("東京タワー")).toBeInTheDocument();
    expect(screen.getByTestId("myNickName").textContent).toBe("myNickName");
    expect(screen.getAllByText("other user").length).toBeGreaterThan(1);
    expect(screen.getAllByText("絶景スポット").length).toBeGreaterThan(1);
    expect(screen.getAllByText("詳細")).toHaveLength(12);
  });
  it("3: Should render detail page", async () => {
    localStorage.setItem("localJWT", token.access);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Core />
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText("東京タワー")).toBeInTheDocument();
    await user.click(screen.getByTestId(`detail-1`));
    expect(mockedNavigator).toBeCalledWith("/post/1");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("4: Should put myprofile successfully", async () => {
    localStorage.setItem("localJWT", token.access);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Core />
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText("myNickName")).toBeInTheDocument();
    await user.click(screen.getByTestId("edit-modal"));
    const inputValue = screen.getByPlaceholderText("nickname");
    await user.type(inputValue, "test user update");
    await user.click(screen.getByText("Update"));
    await user.click(screen.getByTestId("edit-modal"));
    expect(screen.getByTestId("myNickName").textContent).toBe(
      "myNickName update"
    );
  });
  it("5: Should render all the elements when unauthorized user", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Core />
        </MemoryRouter>
      </Provider>
    );
    expect(
      await screen.findByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    ).toBeInTheDocument();
    await user.click(screen.getByTestId("access_no_login"));
    expect(screen.getByText("ログイン")).toBeInTheDocument();
    expect(screen.getByText("新規登録")).toBeInTheDocument();
    expect(await screen.findByText("東京タワー")).toBeInTheDocument();
    expect(screen.getAllByText("詳細")).toHaveLength(12);
  });
  it("6: Should render detail pagewhen unauthorized user", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Core />
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText("東京タワー")).toBeInTheDocument();
    await user.click(screen.getByTestId("detail-1"));
    await expect(mockedNavigator).toBeCalledWith("/post/1");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
});
