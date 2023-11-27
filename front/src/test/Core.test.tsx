import { postData, postData2 } from "./testData/postData";
import {
 profileData,
 updateProfileData,
 myProfileData,
} from "./testData/profileData";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../../src/redux/slices/post/postSlice";
import authReducer from "../../src/redux/slices/auth/authSlice";
import Core from "../../src/pages/Core";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";


const mockedNavigator = vi.fn();
const mockMutateAsync = vi.fn();


vi.mock("react-router-dom", async () => {
 const actual = (await vi.importActual("react-router-dom")) as any;
 return {
   ...actual,
   useNavigate: () => mockedNavigator,
 };
});


vi.mock('../hooks/useQueryHooks', async () => {
 const actual = (await vi.importActual("../hooks/useQueryHooks")) as any;
 return {
   ...actual,
   useLogin: vi.fn().mockImplementation(() => {
     return {
       mutateAsync: mockMutateAsync
     }
   }),
   usePutProfileMutation: vi.fn().mockImplementation(() => {
     return {
       mutateAsync: mockMutateAsync
     }
   }),
 }
})


const token = { refresh: "dummyToken", access: "dummyToken" };


const handlers = [
 rest.post("http://localhost:8000/api/register/", (_, res, ctx) => {
   return res(ctx.status(201));
 }),
 rest.post("http://localhost:8000/authen/jwt/create/", (_, res, ctx) => {
   return res(ctx.status(200), ctx.json(token));
 }),
 rest.get("http://localhost:8000/api/myprofile/", (_, res, ctx) => {
   return res(ctx.status(200), ctx.json(myProfileData));
 }),
 rest.put("http://localhost:8000/api/profile/2", (_, res, ctx) => {
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
 rest.get("http://localhost:8000/api/profile/", (_, res, ctx) => {
   return res(ctx.status(200), ctx.json(profileData));
 }),
 rest.post("http://localhost:8000/api/profile/", (_, res, ctx) => {
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
afterEach(() => {
 server.resetHandlers();
 cleanup();
});
afterAll(() => {
 server.close();
});


const user = userEvent.setup();


const renderCoreComponent = (store: any) => {
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
 let store: any;
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
   renderCoreComponent(store);
   await waitFor(() =>
     screen.getByText(
       "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
     )
   );
   await user.type(screen.getByTestId("email"), "dummy@gmail.com");
   await user.type(screen.getByTestId("password"), "dddd");
   const submitButton = screen.getByTestId("submit-button");
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
   renderCoreComponent(store);
   expect(
     screen.getByText(
       "ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です"
     )
   );
   await user.click(screen.getByText("新規登録はこちら"));
   expect(await screen.findByText("Register"));
   await user.type(screen.getByTestId("email"), "dummy@gmail.com");
   await user.type(screen.getByTestId("password"), "dddd");
   const submitButton = screen.getByTestId("submit-button");
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
   renderCoreComponent(store);
   expect(await screen.findByText("東京タワー")).toBeInTheDocument();
   await user.click(screen.getByTestId(`detail-1`));
   expect(mockedNavigator).toBeCalledWith("/post/1");
   expect(mockedNavigator).toBeCalledTimes(1);
 });
 it("4: Should put myprofile successfully", async () => {
   renderCoreComponent(store);
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
