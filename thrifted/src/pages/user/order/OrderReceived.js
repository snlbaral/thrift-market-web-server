import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";

function OrderReceived(props) {
  useEffect(() => {
    if (localStorage.getItem("notification")) {
      NotificationManager.success("Your order has been successfully placed");
      localStorage.removeItem("notification");
    }
  }, [props]);

  return (
    <section className="container">
      <div className="order-received">
        <div className="col-md-6 ">
          <div className="order-recived-img">
            <img src="https://imgur.com/gdSkKi2.png" className="img-fluid" />
          </div>
          <h3>Your Order Is Completed</h3>
          <p>
            Thank you for your order! Your order is being processed and will be
            completed very soon. You will also receive an email confirmation
            when your order status changes.
          </p>
          <Link
            className=" btn btn-primary order-proceed w-50"
            to="/profile/orders"
          >
            View Orders
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderReceived;
