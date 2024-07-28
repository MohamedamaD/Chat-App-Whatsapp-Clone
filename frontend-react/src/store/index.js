import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./slices/authenticationSlice";
import chatReducer from "./slices/chatSlice";
import appReducer from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    chat: chatReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
