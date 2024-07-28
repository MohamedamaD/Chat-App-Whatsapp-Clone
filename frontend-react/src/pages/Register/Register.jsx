import { register } from "../../store/slices/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { Loading } from "../Loading/Loading";
import { BiUpload } from "react-icons/bi";
import { Button } from "../../components";
import { toast } from "react-hot-toast";

import "./Register.scss";
export const Register = () => {
  const imageUploader = useRef(null);

  const go = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.authentication);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const avatarHandler = (event) => {
    const avatar = event.target.files[0];
    setData((prev) => ({ ...prev, avatar }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!data.avatar) {
      toast.error("please provide a avatar");
      return;
    }
    dispatch(register(data))
      .then((response) => {
        if (register.fulfilled.match(response)) {
          toast.success("welcome");
          go(0);
        } else {
          toast.error(response.payload.message);
        }
      })
      .catch((err) => console.log("err", err));
  };

  if (loading) return <Loading />;
  return (
    <div id="register">
      <div className="container register-container">
        <form action="" onSubmit={submitHandler}>
          <div className="input-field">
            <label className="custom-label" htmlFor="name">
              name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="custom-input"
              value={data.name}
              onChange={changeHandler}
            />
          </div>
          <div className="input-field">
            <label className="custom-label" htmlFor="email">
              email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="custom-input"
              value={data.email}
              onChange={changeHandler}
            />
          </div>
          <div className="input-field">
            <label className="custom-label" htmlFor="password">
              password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="custom-input"
              value={data.password}
              onChange={changeHandler}
            />
          </div>

          <div
            className="profile-picture"
            onClick={() => imageUploader.current.click()}
          >
            <h1 className="upload-icon">
              <BiUpload />
            </h1>
            <span>Drag & Drop image here or click to browse</span>
            <input
              className="file-uploader"
              type="file"
              name="avatar"
              ref={imageUploader}
              onChange={avatarHandler}
              accept="image/*"
            />
          </div>

          {data.avatar && (
            <div className="image-preview">
              <img src={URL.createObjectURL(data.avatar) || ""} alt="" />
            </div>
          )}
          <Button>register</Button>
        </form>
        <div className="toggle-link">
          <p>Already have an account?</p>
          <Link to="/auth/sign-in">Login</Link>
        </div>
      </div>
    </div>
  );
};
