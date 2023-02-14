import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import AdminNav from "../../admin/layout/AdminNav";
import axios from "axios";
import { AddContext, useCartContext } from "../../../global/CartContext";
import $ from "jquery";
import { Oval, TailSpin } from "react-loader-spinner";
import { useQuery, useQueryClient } from "react-query";

function Navbar(props) {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const { cart, pageLoader, currentUser } = useCartContext();

  useQuery(["nav-categories"], getCategories, {
    staleTime: 500000,
    onSuccess: ({ data }) => {
      data.map((category) => {
        category.childrens = category.childrens.sort((a, b) => {
          if (a.childrens.length < b.childrens.length) {
            return 1;
          } else if (a.childrens.length > b.childrens.length) {
            return -1;
          } else return 0;
        });
      });
      setCategories(data);
    },
  });

  function getCategories() {
    return axios.get("/frontend/category");
  }

  function logout(e) {
    localStorage.removeItem("token");
    props.history.push("/login");
  }

  function navToggle() {
    if ($(".sub-nav").hasClass("scale")) {
      $(".sub-nav").removeClass("scale");
    } else {
      $(".sub-nav").addClass("scale");
    }
  }

  function searchResult(e) {
    e.preventDefault();
    props.history.push({
      pathname: "/search/",
      search: `?q=${searchInput}`,
    });
  }

  useEffect(() => {
    $(".page-loader svg").attr("viewBox", "-21.5 -21.5 45 45");
  }, [pageLoader]);

  return (currentUser?.is_admin == 1 || currentUser?.role == "seller") &&
    props.location.pathname.includes("admin") ? (
    <AdminNav user={currentUser} />
  ) : (
    <section className="navbar-section">
      {pageLoader ? (
        <Oval
          height={75}
          width={75}
          strokeWidth={3}
          color="rebeccapurple"
          secondaryColor="#fff"
          wrapperClass="page-loader"
        />
      ) : null}

      <div className="main-nav">
        <div className="nav-left">
          <div className="logo">
            <Link to="/" className="black">
              HamroCloset
            </Link>
          </div>
          <form className="search" onSubmit={(e) => searchResult(e)}>
            <input
              type="text"
              className="search-input"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="search-submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
        <div className="nav-right">
          <ul className="navbar-nav mr-auto ul-profile">
            <li className="nav-item dropdown">
              {localStorage.getItem("token") && (
                <a
                  className="nav-link dropdown-toggle "
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa fa-user" aria-hidden="true"></i>
                </a>
              )}

              {localStorage.getItem("token") ? (
                <div
                  className="dropdown-menu navbar-dropdown"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/profile">
                    <i className="fa fa-user"></i>Profile
                  </Link>
                  <Link className="dropdown-item" to="/profile/address">
                    <i className="fa fa-map-marker"></i>Address
                  </Link>
                  <Link className="dropdown-item" to="/profile/orders">
                    <i className="fa fa-shopping-cart"></i>Order History
                  </Link>
                  <Link className="dropdown-item" to="/profile/sales">
                    <i className="fa fa-history"></i>Sales History
                  </Link>
                  <Link className="dropdown-item" to="/profile/payouts">
                    <i className="fa fa-credit-card-alt"></i>Payouts
                  </Link>
                  <Link className="dropdown-item" to="/create-post">
                    <i className="fa fa-plus-square"></i>Create Post
                  </Link>
                  <Link
                    className="dropdown-item"
                    to={`/closet/${currentUser?._id}`}
                  >
                    <i className="fa fa-female"></i>My Closet
                  </Link>
                  <div
                    className="dropdown-item logout"
                    onClick={() => logout()}
                  >
                    <i className="fa fa-sign-out"></i>Logout
                  </div>
                </div>
              ) : (
                <div className="d-flex position-relative loginNav">
                  <Link to="/login">Login</Link>
                  <Link
                    className="pl-2 left-border"
                    to="/register"
                    onClick={() => logout()}
                  >
                    Register
                  </Link>
                </div>
              )}
            </li>
            {localStorage.getItem("token") && (
              <li>
                <Link to="/cartItems" className="cart">
                  <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                  <span>{cart}</span>
                </Link>
              </li>
            )}
          </ul>

          {
            // <Link className="login" to="/login">Login</Link>
            // <Link className="signup" to="/signup">SignUp</Link>
          }
        </div>
      </div>
      <div className="toggle" onClick={() => navToggle()}>
        <i className="fa fa-bars" aria-hidden="true"></i>
      </div>

      <div className="sub-nav scale">
        <div className="sub-left text-capitalize align-items-center d-flex">
          <div className="all-market mr-3">All Categories</div>
          <ul>
            {categories.map((category) => {
              return (
                <li key={category._id} className="sub-left-link">
                  <Link to={`/category/${category.slug}`}>{category.name}</Link>
                  <ul className="child-categories">
                    {category.childrens.map((child) => {
                      return (
                        <div key={child._id}>
                          <li className="first-child">
                            <Link
                              className="text-main"
                              to={`/category/${child.slug}`}
                            >
                              {child.name}
                            </Link>
                          </li>
                          <ChildCategory childrens={child.childrens} />
                        </div>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sub-right">
          <a href="/#howitwork">HOW IT WORK</a>
          <Link to="/sellerrequest">SELL ON </Link>
        </div>
      </div>
    </section>
  );
}

function ChildCategory({ childrens }) {
  return childrens.map((child) => {
    return (
      <div key={child._id}>
        <li>
          {" "}
          <Link to={`/category/${child.slug}`}>{child.name}</Link>
        </li>
        <ChildCategory childrens={child.childrens} />
      </div>
    );
  });
}

export default withRouter(Navbar);
