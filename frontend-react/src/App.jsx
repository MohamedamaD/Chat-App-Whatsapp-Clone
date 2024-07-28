import {
  Login,
  Register,
  NotFound,
  Password,
  Loading,
  Group,
  ForgotPassword,
  ResetPassword,
  StatusCarousel,
} from "./pages";
import { protectedData } from "./store/slices/authenticationSlice";
import { ProtectedRoutes, UnProtectedRoutes } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { AuthOutlet, HomeOutlet } from "./layouts";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from "react";
import { Chat, GroupInfo } from "./containers";
import Cookie from "js-cookie";
import "./App.scss";

function App() {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.authentication);
  const token = Cookie.get("token");

  useEffect(() => {
    if (token && !user) dispatch(protectedData());
  }, [token, dispatch, user]);

  console.log("app");
  if (loading) return <Loading />;
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route element={<UnProtectedRoutes />}>
          <Route path="/auth" element={<AuthOutlet />}>
            <Route index element={<Login />} />
            <Route path="sign-in" element={<Login />} />
            <Route path="sign-up" element={<Register />} />
            <Route path="password" element={<Password />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<HomeOutlet />}>
            <Route path="conversation/:userID" element={<Chat />} />
            <Route path="groups/:groupID" element={<Group />} />
            <Route path="groups/:groupID/info" element={<GroupInfo />} />
            <Route path="/user-status/:userID" element={<StatusCarousel />} />
          </Route>
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
