import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../src/redux/app/store";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
