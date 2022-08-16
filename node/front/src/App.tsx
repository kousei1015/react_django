import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import Core from "./features/core/Core";
import ModifiedNewPost from "./features/core/ModifiedNewPost";
import UpdatePost from "./features/core/UpdatePost";
import PostDetail from "./features/post/PostDetail";


function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Core />} />
          <Route path="/post/create" element={<ModifiedNewPost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/:id/update" element={<UpdatePost />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
