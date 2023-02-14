import React from "react";
import { Link } from "react-router-dom";
import emptyImg from "../img/empty-order.png";

function EmptyOrder({ title = null, link = null }) {
  return (
    <div className="container text-center">
      <img src={emptyImg} className="img-fluid w-50 my-5" />
      <div className="noresult-title">No Orders yet</div>
      <div className="noresult-para">
        When you do, their status will appear here
      </div>
      {title && link ? (
        <Link to={link} className="noresult-btn">
          {title}
        </Link>
      ) : null}
    </div>
  );
}

export default EmptyOrder;
