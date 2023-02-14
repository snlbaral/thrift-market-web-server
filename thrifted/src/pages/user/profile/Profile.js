import React, { useEffect, useState } from "react";
import { useCartContext } from "../../../global/CartContext";
import UserAddress from "./../address/UserAddress";
import Payouts from "../payout/Payouts";
import PayoutDetail from "../payout/PayoutDetail";
import OrderList from "../order/OrderList";
import SaleHistory from "../sale/SaleHistory";
import Sidebar from "./Sidebar";
import ProfileDetail from "./ProfileDetail";

function Profile(props) {
  const [view, setView] = useState("profile");

  const { currentUser } = useCartContext();

  useEffect(() => {
    if (props.match?.params?.parameter) {
      setView(props.match.params.parameter);
    } else {
      setView("profile");
    }
  }, [props]);

  return (
    <section>
      <div className="container d-flex justify-content-center py-5 m-3">
        <div
          className={
            view == "payout-details"
              ? "col-12"
              : view == "orders"
              ? "col-12"
              : "col-10"
          }
        >
          <div className="row">
            <Sidebar view={view} currentUser={currentUser} />
            <div className="col-md-9 bg-white p-5">
              {view == "profile" ? (
                <ProfileDetail user={currentUser} />
              ) : view == "address" ? (
                <UserAddress />
              ) : view == "payouts" ? (
                <Payouts />
              ) : view == "payout-details" ? (
                <PayoutDetail />
              ) : view == "orders" ? (
                <OrderList />
              ) : view == "sales" ? (
                <SaleHistory />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
