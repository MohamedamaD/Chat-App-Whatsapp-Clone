import "./Login.scss";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { Button } from "../../components";
import { Loading } from "../Loading/Loading";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authenticationSlice";

export const Login = () => {
  const { loading } = useSelector((state) => state.authentication);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const go = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(login({ email }))
      .then((data) => {
        if (login.fulfilled.match(data)) {
          toast.success(data.payload.message);
          go("/auth/password", { state: data.payload.data.user });
        } else {
          toast.error(data.payload.message || "error ");
        }
      })
      .catch((err) => console.log("err", err));
  };

  if (loading) return <Loading />;

  return (
    <div id="login">
      <div className="container login-container">
        <div className="heading">
          <h1>
            welcome <br />
            to whatsapp
          </h1>
        </div>
        <form action="" onSubmit={submitHandler}>
          <div className="input-field">
            <label className="custom-label" htmlFor="email">
              email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="custom-input"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <Button>login</Button>
        </form>
        <div className="toggle-link">
          <p>Already have an account?</p>
          <Link to="/auth/sign-up">register</Link>
        </div>
        <div className="reset-password">
          <p>forgot-password?</p>
          <Link to="/auth/forgot-password">restore</Link>
        </div>
      </div>
    </div>
  );
};
