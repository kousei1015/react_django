import React from "react";
import { GlobalStyles } from "./GlobalStyles";
import { AppStyles } from "./AppStyles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Core from "./pages/Core";
import NewPost from "./pages/NewPost";
import UpdatePost from "./pages/UpdatePost";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <>
      <GlobalStyles />
      <AppStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Core />} />
          <Route path="/post/create" element={<NewPost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/:id/update" element={<UpdatePost />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
