import React from "react";
import { GlobalStyles } from "./Global";
import { AppStyles } from "./AppStyles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Core from "./features/core/Core";
import NewPost from "./features/core/NewPost";
import UpdatePost from "./features/core/UpdatePost";
import PostDetail from "./features/post/PostDetail";

function App() {
  return (
    <>
      <BrowserRouter>
        <GlobalStyles />
        <AppStyles />
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
