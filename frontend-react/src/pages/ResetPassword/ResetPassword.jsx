import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loading } from "../Loading/Loading";
import { Button } from "../../components";
import React, { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import "./ResetPassword.scss";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const go = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    if (!password) {
      toast.error(`Password field is required`);
      return;
    }
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    setPassword("");

    api
      .post("api/v1/users/reset-password", {
        email,
        newPassword: password,
        token,
      })
      .then((response) => {
        console.log("response", response);
        toast.success(response.data.message);

        go("/auth/password", { state: response.data.user });
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };
  if (loading) return <Loading />;
  return (
    <div id="reset-password">
      <div className="container">
        <div className="heading">
          <h1>enter new password to confirm</h1>
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
          <Button>Reset Password</Button>
        </form>
        <div className="toggle-link">
          <p></p>
          <Link to="/auth/sign-up">back to register ?</Link>
        </div>
      </div>
    </div>
  );
};
