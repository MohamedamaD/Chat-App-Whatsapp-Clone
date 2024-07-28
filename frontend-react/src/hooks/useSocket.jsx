import Cookies from "js-cookie";
import { io } from "socket.io-client";
import { ioConfig, url } from "../services/io";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConnection } from "../store/slices/appSlice";

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const _token = Cookies.get("token");
    ioConfig.auth.token = _token;

    const socket = io(url, ioConfig);

    socket.on("connect", () => {
      dispatch(setConnection(socket));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};
