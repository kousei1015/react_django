import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import Auth from "../features/auth/Auth";


const user = userEvent.setup();

describe("Auth Test", () => {
  let store;
  beforeEach(() => {
    localStorage.clear();
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
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
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
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    expect(
      screen.getByText(
        "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
      )
    );
    await user.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "dddd");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    });
    it("3: Should disable attribute is removed with proper character format in register modal", async () => {
      render(
        <Provider store={store}>
          <Auth />
        </Provider>
      );
      await user.click(screen.getByText("新規登録はこちら"));
      expect(await screen.findByText("Register"));
      await user.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
      await user.type(screen.getByLabelText(/password/i), "dddd");
      const submitButton = screen.getByTestId("submit-button", {
        name: /submit/i,
      });
      await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
  it("4: Should not submit with too short email", async () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    await user.type(screen.getByLabelText(/email/i), "a");
    await user.type(screen.getByLabelText(/password/i), "aaaaa");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    expect(submitButton).toBeDisabled();
  });
  it("5: Should not submit with too short password", async () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    await user.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "a");
    const submitButton = screen.getByTestId("submit-button", {
      name: /submit/i,
    });
    expect(submitButton).toBeDisabled();
  });
});
