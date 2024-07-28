import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { user } = useSelector((state) => state.authentication);
  return user ? <Outlet /> : <Navigate to={"/auth/sign-in"} replace={true} />;
};

export const UnProtectedRoutes = () => {
  const { user } = useSelector((state) => state.authentication);
  return !user ? <Outlet /> : <Navigate to={"/"} replace={true} />;
};
