import { confirmPassword } from "../../store/slices/authenticationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button } from "../../components";
import { Loading } from "../Loading/Loading";
import { toast } from "react-hot-toast";
import React, { useState } from "react";

import "./Password.scss";
export const Password = () => {
  const go = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location);
  const [password, setPassword] = useState("");
  const { loading } = useSelector((state) => state.authentication);

  const submitHandler = (event) => {
    event.preventDefault();

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    dispatch(confirmPassword({ userId: location.state?._id, password }))
      .then((data) => {
        if (confirmPassword.fulfilled.match(data)) {
          toast.success(data.payload.message);
          go("/");
        } else {
          toast.error(data?.payload?.message || data.error.message || "error ");
        }
      })
      .catch((err) => console.log("err", err));
  };

  if (loading) return <Loading />;

  return (
    <div id="password">
      <div className="container password-container">
        <div className="user-info rounded">
          <Avatar className="large" displayName={true} user={location.state} />
        </div>
        <form action="" onSubmit={submitHandler}>
          <div className="input-field">
            <label className="custom-label" htmlFor="password">
              password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="custom-input"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <Button>Sign Up</Button>
        </form>
      </div>
    </div>
  );
};
