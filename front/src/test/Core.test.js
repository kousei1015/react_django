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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useLogin,
  useRegister,
  usePutProfileMutation,
} from "../features/query/queryHooks";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

jest.mock("../features/query/queryHooks", () => ({
  ...jest.requireActual("../features/query/queryHooks"),
  useLogin: jest.fn(),
  useRegister: jest.fn(),
  usePutProfileMutation: jest.fn(),
}));

const token = { refresh: "dummyToken", access: "dummyToken" };

const handlers = [
  rest.post("http://localhost:8000/api/register/", (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.post("http://localhost:8000/authen/jwt/create/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(token));
  }),
  rest.get("http://localhost:8000/api/myprofile/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(myProfileData));
  }),
  rest.put("http://localhost:8000/api/profile/2", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(updateProfileData));
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
afterEach(() => {;
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

const user = userEvent.setup();

const renderCoreComponent = (store) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter>
          <Core />
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );
};

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
  it("1: Should render all elements when login successfully", async () => {
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    root.setAttribute("data-testid", "app-element");
    document.body.appendChild(root);
    const mockMutateAsync = jest.fn();
    useLogin.mockReturnValue({ mutateAsync: mockMutateAsync });
    renderCoreComponent(store)
    await waitFor(() =>
      screen.getByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    );
    await user.type(screen.getByTestId("email"), "dummy@gmail.com");
    await user.type(screen.getByTestId("password"), "dddd");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: "dummy@gmail.com",
        password: "dddd",
      });
    });
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
  it("2: Should render all elements when register successfully", async () => {
    const mockMutateAsync = jest.fn();
    useRegister.mockReturnValue({ mutateAsync: mockMutateAsync });
    useLogin.mockReturnValue({ mutateAsync: mockMutateAsync });
    renderCoreComponent(store)
    expect(
      screen.getByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    );
    await user.click(screen.getByText("新規登録はこちら"));
    expect(await screen.findByText("Register"));
    await user.type(screen.getByTestId("email"), "dummy@gmail.com");
    await user.type(screen.getByTestId("password"), "dddd");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: "dummy@gmail.com",
        password: "dddd",
      });
    });
    await waitFor(() => expect(submitButton).not.toBeInTheDocument());
    expect(screen.getByText("Map Collection")).toBeInTheDocument();
    expect(screen.getByText("ログアウト")).toBeInTheDocument();
    expect(screen.getByText("新規投稿")).toBeInTheDocument();
    expect(await screen.findByText("東京タワー")).toBeInTheDocument();
    expect(screen.getByTestId("myNickName").textContent).toBe("myNickName");
    expect(screen.getAllByText("other user").length).toBeGreaterThan(1);
    expect(screen.getAllByText("絶景スポット").length).toBeGreaterThan(1);
    expect(screen.getAllByText("詳細")).toHaveLength(12);
  });
  it("3: Should route to detail page", async () => {
    renderCoreComponent(store)
    expect(await screen.findByText("東京タワー")).toBeInTheDocument();
    await user.click(screen.getByTestId(`detail-1`));
    expect(mockedNavigator).toBeCalledWith("/post/1");
    expect(mockedNavigator).toBeCalledTimes(1);
  });
  it("4: Should put myprofile successfully", async () => {
    const mockMutateAsync = jest.fn();
    usePutProfileMutation.mockReturnValue({ mutateAsync: mockMutateAsync });
    renderCoreComponent(store)
    expect(await screen.findByText("myNickName")).toBeInTheDocument();
    await user.click(screen.getByTestId("edit-modal"));
    const inputValue = screen.getByPlaceholderText("nickname");
    await user.type(inputValue, "myNickName update");
    await user.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 2,
        nickName: "myNickName update",
        img: null,
      });
    });
  });
});
