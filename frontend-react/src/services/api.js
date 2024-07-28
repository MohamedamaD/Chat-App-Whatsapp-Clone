import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_ENDPOINT_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
