import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { firebaseAuth } from "../../FirebaseConfig";
import { PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { useCartContext } from "../../global/CartContext";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../global/Notification";
import { v4 as uuidv4 } from "uuid";

function ForgotPassword(props) {
  const [phone, setPhone] = useState(0);
  const captchaRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setPageLoader } = useCartContext();

  async function changePassword(e) {
    setIsSubmitting(true);
    e.preventDefault();
    const data = {
      phone,
    };
    try {
      setIsSubmitting(true);
      // check if phone exists
      await axios.post("/user/forgot/check/phone", data);
      setCaptcha();
      data.phone = "+977" + data.phone;
      const phoneProvider = new PhoneAuthProvider(firebaseAuth);
      const verifyId = await phoneProvider.verifyPhoneNumber(
        data.phone,
        captchaRef.current
      );
      data.code = uuidv4();
      data.phone = phone;
      await axios.post("/user/forgot/password", data);
      customSuccessNotification("OTP sent to your phone.");
      props.history.push("/reset-password/?code=" + verifyId);
    } catch (error) {
      setIsSubmitting(false);
      apiErrorNotification(error);
    }
  }

  const setCaptcha = () => {
    captchaRef.current = new RecaptchaVerifier(
      "recaptcha_container",
      { size: "invisible" },
      firebaseAuth
    );
  };

  return (
    <div className="container mb-5">
      <section className="signup py-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card py-3">
              <h3 className="text-center m-3 mt-4">Forgot Password?</h3>
              <form
                className=" mx-auto pb-5 pt-3 signup-form"
                onSubmit={(e) => changePassword(e)}
                autoComplete="off"
              >
                <div className="form-group">
                  <label>Enter Your Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div id="recaptcha_container"></div>
                <button
                  disabled={isSubmitting ? true : false}
                  className="btn  order-proceed mt-3 w-100"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
