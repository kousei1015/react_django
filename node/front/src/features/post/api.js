import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/"
});

API.interceptors.request.use((req) => {
  req.headers.Authorization = `JWT ${localStorage.localJWT}`;
  return req;
});

export const fetchAsyncGetPosts = () => API.get(`post/`);
export const fetchAsyncGetDetail = (id) => API.get(`post/${id}`);
export const fetchAsyncNewPost = (uploadData) => API.post(`post/`, uploadData);
export const fetchDeletePost = (id) => API.delete(`post/${id}`);
export const fetchEditPost = (id, EditPost) => API.patch(`/post/${id}`, EditPost);
export const fetchAsyncGetComments = () => API.get(`comment/`);
export const fetchAsyncPostComment = (comment) => API.post(`comment/`, comment);


export default API;
