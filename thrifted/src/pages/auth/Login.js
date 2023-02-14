import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCartContext } from "../../global/CartContext";
import jwt_decode from "jwt-decode";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../global/Notification";
import { useQueryClient } from "react-query";

function Login(props) {
  const { setPageLoader, setCurrentUser } = useCartContext();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      props.history.push("/");
    }
  }, [props]);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  async function loginform(e) {
    e.preventDefault();
    setPageLoader(true);
    try {
      const response = await axios.post("/user", data);
      localStorage.setItem("token", response.data.token);
      var decode = jwt_decode(localStorage.getItem("token"));
      setCurrentUser(decode);
      setPageLoader(false);
      customSuccessNotification("Login success");

      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      if (response.data?.is_admin == 1) {
        props.history.push("/admin/dashboard");
      } else {
        props.history.push("/");
      }
    } catch (error) {
      apiErrorNotification(error);
      setPageLoader(false);
    }
  }

  function userval(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <section className="signup py-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card py-3">
            <h4 className="m-3 mt-4 text-uppercase text-center ml-4 mb-4">
              LogIn
            </h4>
            {/* <div className="d-flex fb-container">
              <button class="facebook" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  version="1"
                >
                  <path
                    fill="#FFFFFF"
                    d="M32 30a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v28z"
                  />
                  <path
                    fill="#4267b2"
                    d="M22 32V20h4l1-5h-5v-2c0-2 1.002-3 3-3h2V5h-4c-3.675 0-6 2.881-6 7v3h-4v5h4v12h5z"
                  />
                </svg>
                Sign in with Facebook
              </button>

              <button type="button" class="google">
                Sign in with Google
              </button>
            </div>
            <fieldset className="mt-5">
              <legend>Or Fill out </legend>
            </fieldset> */}
            <form
              className=" mx-auto pb-5 pt-3 signup-form"
              onSubmit={(e) => loginform(e)}
              autoComplete="off"
            >
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={(e) => userval(e)}
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter Email"
                  required
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={(e) => userval(e)}
                  id="exampleInputPassword1"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <div className="form-group">
                  <input type="checkbox" /> &nbsp; Remember me
                </div>
                <Link class="form-group" to="/forgot-password">
                  Forgot your password
                </Link>
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-secondary order-proceed mt-3 w-100"
                >
                  Login
                </button>
              </div>
              <div className="wrapper mt-5">
                <p className="text-uppercase">
                  <strong>Are you a new user ?</strong>
                </p>
                <p className="mb-0">Create new account to track your order</p>
                <p className="mt-0">Create a wishlist and more</p>
              </div>
              <Link
                to="/register"
                className="btn btn-secondary btn-createac mt-3 text-uppercase w-100"
              >
                Create account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
