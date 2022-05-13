import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api/' });

export const fetchAsyncGetDetail = (id) => API.get(`/post/${id}`);