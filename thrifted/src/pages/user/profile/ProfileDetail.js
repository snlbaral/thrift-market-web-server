import React from "react";
import { Link } from "react-router-dom";

function ProfileDetail({ user }) {
  return (
    <section>
      <h5 className="mb-0">My Profile</h5>
      <div className="row justify-content-between pt-4">
        <div className="col-md-5">
          <div className="userprofiledetail mb-3">
            <p className="m-0">Name</p>
            <div className="d-flex justify-content-between mb-3">
              <span className="user-value text-capitalize">{user.name}</span>
              <Link to="/edit-profile">Change Password</Link>
            </div>
          </div>
          <div className="userprofiledetail mb-3">
            <p className="m-0">Email</p>
            <div className="d-flex justify-content-between mb-3">
              <span className="user-value">{user.email} </span>
            </div>
          </div>
          <div className="userprofiledetail mb-3">
            <p className="m-0">User Id</p>
            <div className=" mb-3">
              <span className="user-value">{user._id} </span>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="userprofiledetail mb-3">
            <p className="m-0">Available Balance</p>
            <div className=" mb-3">
              <span className="user-value">Rs.{user.balance}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileDetail;
