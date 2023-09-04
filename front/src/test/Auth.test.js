import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/auth/authSlice";
import Auth from "../pages/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegister } from "../hooks/useQueryHooks";

const user = userEvent.setup();

jest.mock("../hooks/useQueryHooks", () => ({
  ...jest.requireActual("../hooks/useQueryHooks"),
  useRegister: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

export const renderAuthComponent = (store) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Auth />
      </Provider>
    </QueryClientProvider>
  );
};

describe("Auth Test", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });
  it("1: Should render all the elements", async () => {
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    root.setAttribute("data-testid", "app-element");
    document.body.appendChild(root);
    renderAuthComponent(store);
    expect(
      screen.getByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    );
    expect(screen.getByPlaceholderText("Emailを入力してください"));
    expect(screen.getByPlaceholderText("パスワードを入力してください"));
    expect(screen.getByText("Login"));
    await user.click(screen.getByText("新規登録はこちら"));
    expect(
      screen.getByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    );
    expect(screen.getByPlaceholderText("Emailを入力してください"));
    expect(screen.getByPlaceholderText("パスワードを入力してください"));
    expect(screen.getByText("Register"));
    expect(screen.getByText("ログインはこちら"));
  });
  it("2: Should disable attribute is removed with proper character format in login modal", async () => {
    renderAuthComponent(store);
    expect(
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
  });
  it("3: Should disable attribute is removed with proper character format in register modal", async () => {
    renderAuthComponent(store);
    await user.click(screen.getByText("新規登録はこちら"));
    expect(await screen.findByText("Register"));
    await user.type(screen.getByTestId("email"), "dummy@gmail.com");
    await user.type(screen.getByTestId("password"), "dddd");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
  it("4: Should not submit with too short email", async () => {
    renderAuthComponent(store);
    await user.type(screen.getByTestId("email"), "a");
    await user.type(screen.getByTestId("password"), "aaaaa");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    expect(submitButton).toBeDisabled();
  });
  it("5: Should not submit with too short password", async () => {
    renderAuthComponent(store);
    await user.type(screen.getByTestId("email"), "dummy@gmail.com");
    await user.type(screen.getByTestId("password"), "a");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    expect(submitButton).toBeDisabled();
  });
});
