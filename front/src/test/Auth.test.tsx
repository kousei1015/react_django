import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../src/redux/slices/auth/authSlice";
import Auth from "../../src/pages/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const user = userEvent.setup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

export const renderAuthComponent = (store: any) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Auth />
      </Provider>
    </QueryClientProvider>
  );
};

describe("Auth Test", () => {
  let store: any;
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
    const submitButton = screen.getByTestId("submit-button");
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
  it("3: Should disable attribute is removed with proper character format in register modal", async () => {
    renderAuthComponent(store);
    await user.click(screen.getByText("新規登録はこちら"));
    expect(await screen.findByText("Register"));
    await user.type(screen.getByTestId("email"), "dummy@gmail.com");
    await user.type(screen.getByTestId("password"), "dddd");
    const submitButton = screen.getByTestId("submit-button");
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
  it("4: Should not submit with too short email", async () => {
    renderAuthComponent(store);
    await user.type(screen.getByTestId("email"), "a");
    await user.type(screen.getByTestId("password"), "aaaaa");
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });
  it("5: Should not submit with too short password", async () => {
    renderAuthComponent(store);
    await user.type(screen.getByTestId("email"), "dummy@gmail.com");
    await user.type(screen.getByTestId("password"), "a");
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });
});
