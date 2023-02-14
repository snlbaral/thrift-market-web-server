import React from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import $ from "jquery";

function AdminNav(props) {
  const history = useHistory();

  function distroy(e) {
    localStorage.removeItem("token");
    history.push("/");
  }

  let sidebar = document.querySelector(".sidebar");
  let closeBtn = document.querySelector("#btn");
  let searchBtn = document.querySelector(".bx-search");

  function dashboard() {
    $(".sidebar").toggleClass("open");
    menuBtnChange();
  }

  // following are the code to change sidebar button(optional)
  function menuBtnChange() {
    if ($(".sidebar").hasClass("open")) {
      $("#btn").removeClass("fa-bars");
      $("#btn").addClass("fa-align-right");
    } else {
      $("#btn").removeClass("fa-align-right");
      $("#btn").addClass("fa-bars");
    }
  }

  return (
    <div class="sidebar">
      <div class="logo-details">
        <i class="fa fa-bandcamp icon" aria-hidden="true"></i>
        <div class="logo_name">Ecommerce</div>
        <i
          class="fa fa-bars"
          id="btn"
          onClick={(e) => dashboard(e)}
          aria-hidden="true"
        ></i>
      </div>
      <ul class="nav-list">
        <li>
          <Link to="/admin/dashboard">
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <span class="links_name">Dashboard</span>
          </Link>
          <span class="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/admin/banner">
            <i class="fa fa-audio-description" aria-hidden="true"></i>
            <span class="links_name">Banners</span>
          </Link>
          <span class="tooltip">Banners</span>
        </li>
        <li>
          <Link to="/admin/brand">
            <i class="fa fa-star" aria-hidden="true"></i>
            <span class="links_name">Brands</span>
          </Link>
          <span class="tooltip">Brands</span>
        </li>
        <li>
          <Link to="/admin/category">
            <i class="fa fa-th" aria-hidden="true"></i>
            <span class="links_name">Categories</span>
          </Link>
          <span class="tooltip">Categories</span>
        </li>
        <li>
          <Link to="/admin/color">
            <i class="fa fa-star" aria-hidden="true"></i>
            <span class="links_name">Colors</span>
          </Link>
          <span class="tooltip">Brands</span>
        </li>
        <li>
          <Link to="/admin/user">
            <i class="fa fa-user-o"></i>
            <span class="links_name">Customers</span>
          </Link>
          <span class="tooltip">Customers</span>
        </li>
        <li>
          <Link to="/admin/order">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            <span class="links_name">Order</span>
          </Link>
          <span class="tooltip">Order</span>
        </li>

        <li>
          <Link to="/admin/order-track">
            <i class="fa fa-product-hunt" aria-hidden="true"></i>
            <span class="links_name">Order Track</span>
          </Link>
          <span class="tooltip">Order Track</span>
        </li>
        <li>
          <Link to="/admin/product">
            <i class="fa fa-product-hunt" aria-hidden="true"></i>
            <span class="links_name">Products</span>
          </Link>
          <span class="tooltip">Products</span>
        </li>

        <li>
          <Link to="/admin/shipping">
            <i class="fa fa-cog" aria-hidden="true"></i>
            <span class="links_name">Shipping</span>
          </Link>
          <span class="tooltip">Shipping</span>
        </li>
        <li class="profile">
          <div class="profile-details">
            <Link to="/admin/profile">
              <i class="fa fa-cog" aria-hidden="true"></i>

              <div class="name_job">
                <div class="name">{props.user.name}</div>
                <div class="job">{props.user.role}</div>
              </div>
            </Link>
          </div>
          <i class="fa fa-sign-out" id="log_out" aria-hidden="true"></i>
        </li>
      </ul>
    </div>
  );
}

export default withRouter(AdminNav);
