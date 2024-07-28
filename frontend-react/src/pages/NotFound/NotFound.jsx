import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const go = useNavigate();
  useEffect(() => {
    go("/", { replace: true });
  }, [go]);
  return <div></div>;
};
