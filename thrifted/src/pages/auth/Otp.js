import React, { useState } from "react";
import { firebaseAuth } from "../../FirebaseConfig";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useCartContext } from "../../global/CartContext";
import {
  apiErrorNotification,
  customErrorNotification,
} from "../../global/Notification";

function Otp({ handleSubmit, verificationId }) {
  const [code, setCode] = useState();
  const { setPageLoader } = useCartContext();

  async function submitOTP(e) {
    try {
      setPageLoader(true);
      e.preventDefault();
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(firebaseAuth, credential);
      await handleSubmit();
    } catch (error) {
      if (error.message.includes("Firebase")) {
        customErrorNotification("Invalid or Expired Code");
      } else {
        apiErrorNotification(error);
      }
    }
    setPageLoader(false);
  }

  return (
    <section className="signup">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <h3 className="text-center m-3">Enter OTP Code</h3>

            <form
              className=" mx-auto py-5 signup-form"
              onSubmit={(e) => submitOTP(e)}
              autoComplete="off"
            >
              <div className="form-group">
                <input
                  type="number"
                  name="name"
                  onChange={(e) => setCode(e.target.value)}
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Enter OTP Code"
                  required
                />
              </div>
              <button type="submit" className="btn  order-proceed mt-3 w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Otp;
