import React from "react";
import { Link } from "react-router-dom";
import emptyImg from "../img/empty-search.png";

function NoResult({ title = null, link = null }) {
  return (
    <div className="container text-center">
      <img src={emptyImg} className="img-fluid" />
      <div className="noresult-title">No Result Found</div>
      <div className="noresult-para">
        Sorry, there are no results for this search.
      </div>
      <div className="noresult-para">please try another Phrase</div>
      {title && link ? (
        <Link to={link} className="noresult-btn">
          {title}
        </Link>
      ) : null}
    </div>
  );
}

export default NoResult;
