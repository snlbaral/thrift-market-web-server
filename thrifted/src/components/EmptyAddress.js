import React from "react";
import { Link } from "react-router-dom";
import emptyImg from "../img/empty-address.png";

function EmptyAddress({ title = null, link = null }) {
  return (
    <div className="container text-center">
      <img src={emptyImg} className="img-fluid w-50 " />
      <div className="noresult-title">No Address Added yet</div>
      <div className="noresult-para">Click the button below to add</div>
      {title && link ? (
        <Link to={link} className="noresult-btn">
          {title}
        </Link>
      ) : null}
    </div>
  );
}

export default EmptyAddress;
