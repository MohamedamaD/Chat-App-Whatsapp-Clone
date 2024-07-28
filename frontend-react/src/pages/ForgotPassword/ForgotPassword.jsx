import { Loading } from "../Loading/Loading";
import { Button } from "../../components";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import "./ForgotPassword.scss";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    setEmail("");

    api
      .post("api/v1/users/forgot-password", { email })
      .then((response) => {
        console.log("response", response);
        toast.success("check your email for new password");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  if (loading) return <Loading />;
  return (
    <div id="forgot-password">
      <div className="container forgot-container">
        <div className="heading">
          <h1>don't worry about this password any more</h1>
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
          <Button>restore</Button>
        </form>
        <div className="toggle-link">
          <p>Already have an account?</p>
          <Link to="/auth/sign-in">Login</Link>
        </div>
      </div>
    </div>
  );
};
