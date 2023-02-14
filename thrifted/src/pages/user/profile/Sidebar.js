import React from "react";
import { Link, useHistory } from "react-router-dom";

function Sidebar({ view, currentUser }) {
  const history = useHistory();
  function logout(e) {
    localStorage.removeItem("token");
    history.push("/login");
  }

  return (
    <div className="col-md-3">
      <div className="profile-user-name">
        <h4>{currentUser.name}</h4>
        <div role={"button"} onClick={() => logout()}>
          Sign Out
        </div>
      </div>
      <div className="profile-sidebar">
        <div className="d-flex w-100 justify-content-between ">
          <Link
            className={`${view === "profile" ? "active" : ""}`}
            to="/profile"
          >
            {" "}
            <i className="fa fa-user"></i>Profile
          </Link>
        </div>
        <div className="d-flex w-100 justify-content-between ">
          <Link
            to="/profile/address"
            className={`${view === "address" ? "active" : ""}`}
          >
            <i className="fa fa-map-marker"></i>Address
          </Link>
        </div>
        <div className="d-flex w-100 justify-content-between ">
          <Link
            to={`/edit-pickup-location/${currentUser.pickup?._id}`}
            className={`${view === "iaddress" ? "active" : ""}`}
          >
            <i className="fa fa-map-marker"></i>Edit Pickup Location
          </Link>
        </div>
        <div className="d-flex w-100 justify-content-between ">
          <Link to="/create-post">
            <i class="fa fa-plus-square" aria-hidden="true"></i>Create Post
          </Link>
        </div>
        <div className="d-flex w-100 justify-content-between ">
          <Link
            className={`${view === "payouts" ? "active" : ""}`}
            to="/profile/payouts"
          >
            <i class="fa fa-credit-card-alt" aria-hidden="true"></i>
            Payouts
          </Link>
        </div>
        <div className="d-flex w-100 justify-content-between ">
          <Link
            className={`${view === "orders" ? "active" : ""}`}
            to="/profile/orders"
          >
            <i className="fa fa-shopping-cart"></i>Orders History
          </Link>
        </div>
        <div className="d-flex w-100 justify-content-between ">
          <Link
            className={`${view === "sales" ? "active" : ""}`}
            to="/profile/sales"
          >
            <i class="fa fa-history" aria-hidden="true"></i>Sales History
          </Link>
        </div>
        <div className="d-flex w-100 justify-content-between ">
          <Link
            className={`${view === "payout-details" ? "active" : ""}`}
            to="/profile/payout-details"
          >
            <i class="fa fa-info-circle" aria-hidden="true"></i>Payout Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
