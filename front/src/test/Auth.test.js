import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import Auth from "../features/auth/Auth";
import { getByLabelText } from "@testing-library/react";

const handlers = [
  rest.post("http://localhost:8000/authen/jwt/create/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ refresh: "abc123" }));
  }),
  rest.post("http://localhost:8000/api/register/", (req, res, ctx) => {
    return res(ctx.status(201));
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

describe("Auth Test", () => {
  let store;
  beforeAll(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });
  it("1: Should render all the elements", async () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    //screen.debug();
  });
  it("2: Should login successfully", async () => {
    const handleSubmit = jest.fn();
    render(
      <Provider store={store}>
        <Auth onSubmit={handleSubmit} />
      </Provider>
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "dymmy@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "dddd");

    const  submitButton = screen.getByTestId("submit-button", {name: /submit/i})

    await waitFor(() => expect(submitButton).not.toBeDisabled())
  });
  it("3: Should not submit with too short email", async () => {
    const handleSubmit = jest.fn();
    render(
      <Provider store={store}>
        <Auth onSubmit={handleSubmit} />
      </Provider>
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "a");
    await user.type(screen.getByLabelText(/password/i), "dddd");

    const  submitButton = screen.getByTestId("submit-button", {name: /submit/i})

    await waitFor(() => expect(submitButton).toBeDisabled())
    
  });
  it("4: Should not submit with too short password", async () => {
    const handleSubmit = jest.fn();
    render(
      <Provider store={store}>
        <Auth onSubmit={handleSubmit} />
      </Provider>
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "dummy@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "a");

    const  submitButton = screen.getByTestId("submit-button", {name: /submit/i})

    await waitFor(() => expect(submitButton).toBeDisabled())
  });
});
