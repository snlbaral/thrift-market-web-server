import React from "react";
import { Link } from "react-router-dom";
import emptyImg from "../img/empty-cart.png";

function EmptyCart({ title = null, link = null }) {
  return (
    <div className="container text-center">
      <img src={emptyImg} className="img-fluid " />
      <div className="noresult-title">Your Cart is Empty</div>
      <div className="noresult-para">
        Looks like you haven't added any items yet
      </div>
      {title && link ? (
        <Link to={link} className="noresult-btn">
          {title}
        </Link>
      ) : null}
    </div>
  );
}

export default EmptyCart;
