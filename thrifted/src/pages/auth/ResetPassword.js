import React, { useContext, useState } from "react";
import axios from "axios";
import { useCartContext } from "../../global/CartContext";
import {
  apiErrorNotification,
  customErrorNotification,
  customSuccessNotification,
} from "./../../global/Notification";

function ResetPassword(props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [OTP, setOTP] = useState(0);

  const { setPageLoader } = useCartContext();

  const code = props.location.search.replace("?code=", "");
  console.log(code);

  async function resetPassword(e) {
    e.preventDefault();
    setPageLoader(true);
    const data = {
      newPassword,
      confirmPassword,
      code,
      OTP,
    };
    try {
      await axios.post("/user/reset/password", data);
      customSuccessNotification("Password reset success");
      props.history.push("/login");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  return (
    <div className="container py-5 mb-5">
      <section className="signup py-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card py-3">
              <h3 className="text-center m-3 mt-4">Reset Password</h3>
              <form
                className=" mx-auto pb-5 pt-3 signup-form"
                onSubmit={(e) => resetPassword(e)}
              >
                <div className="form-group">
                  <label>OTP Code</label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={(e) => setOTP(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  disabled={isSubmitting ? true : false}
                  className="btn  order-proceed mt-3 w-100"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
