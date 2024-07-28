export const url =
  process.env.REACT_APP_ENDPOINT_BASE || "http://localhost:8080";

export const ioConfig = {
  withCredentials: true,
  auth: {},
};
