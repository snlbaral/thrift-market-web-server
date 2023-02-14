import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { firebaseAuth } from "../../FirebaseConfig";
import { PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import Otp from "./Otp";
import { useCartContext } from "../../global/CartContext";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "../../global/Notification";
import ReactSelect from "react-select";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const captchaRef = useRef();
  const [verificationId, setVerificationId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setPageLoader } = useCartContext();

  async function signup() {
    setPageLoader(true);
    const data = {
      name,
      email,
      password,
      gender,
      phone,
    };
    try {
      await axios.post("/user/all", data);
      customSuccessNotification("Registration successful");
      props.history.push("/login");
    } catch (error) {
      apiErrorNotification(error);
      setPageLoader(false);
    }
  }

  const sendOtp = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const body = {
        phone: phone,
        email: email,
      };
      await axios.post("/user/check/email", body);
      setCaptcha();
      const phoneProvider = new PhoneAuthProvider(firebaseAuth);
      const response = await phoneProvider.verifyPhoneNumber(
        "+977" + phone,
        captchaRef.current
      );
      setVerificationId(response);
      customSuccessNotification("OTP sent to your phone.");
    } catch (error) {
      setIsSubmitting(false);
      apiErrorNotification(error);
    }
  };

  const setCaptcha = () => {
    captchaRef.current = new RecaptchaVerifier(
      "recaptcha_container",
      { size: "invisible" },
      firebaseAuth
    );
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      props.history.push("/");
    }
  }, [props]);

  return verificationId ? (
    <Otp handleSubmit={signup} verificationId={verificationId} />
  ) : (
    <section className="signup py-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card py-3">
            <h3 className="text-center m-3 mt-4">Create Your Account</h3>
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
            </div> */}
            {/* <fieldset className="mt-5">
              <legend>Fill out the form </legend>
            </fieldset> */}
            <form
              className=" mx-auto pb-5 pt-3 signup-form"
              onSubmit={(e) => sendOtp(e)}
              autoComplete="off"
            >
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="number"
                  className="form-control"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter Phone Number"
                  required
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your phone with anyone else.
                </small>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="exampleInputPassword1"
                  placeholder="Password"
                  required
                />
                <small id="emailHelp" className="form-text text-muted">
                  Must be at least 6 characters and must contain a number or
                  symbol.
                </small>
              </div>
              <div className="form-group">
                <ReactSelect
                  className="basic-single"
                  classNamePrefix="select"
                  name="gender"
                  options={[
                    {
                      label: "Male",
                      value: "male",
                    },
                    {
                      label: "Female",
                      value: "female",
                    },
                    {
                      label: "Others",
                      value: "others",
                    },
                  ]}
                  placeholder="Select Gender"
                  onChange={({ value }) => setGender(value)}
                  required={true}
                />
              </div>
              <div className="form-group">
                <p id="emailHelp" className="form-text text-muted text-center">
                  We don’t spam. By creating an account,
                  <br /> you agree to our's Terms and Privacy Policy.
                </p>
              </div>
              <div id="recaptcha_container"></div>
              <button
                type="submit"
                className="btn  order-proceed mt-3 w-100"
                disabled={isSubmitting ? true : false}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
