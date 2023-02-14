import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AddContext, useCartContext } from "../../../global/CartContext";
import {
  customSuccessNotification,
  apiErrorNotification,
} from "./../../../global/Notification";

function EditProfile(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { config, setPageLoader } = useCartContext();

  async function editProfile(e) {
    setPageLoader(true);
    e.preventDefault();
    const data = {
      currentPassword,
      newPassword,
      confirmPassword,
    };
    try {
      await axios.post("/user/change/password", data, config);
      customSuccessNotification("Profile Updated");
      props.history.goBack();
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
              <h3 className="text-center m-3 mt-4">Change Password</h3>
              <form
                className="mx-auto pb-5 pt-3 signup-form"
                onSubmit={(e) => editProfile(e)}
              >
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="newPassword"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirmPassword"
                    required
                  />
                </div>

                <button className="btn  order-proceed mt-3 w-100">Save</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
