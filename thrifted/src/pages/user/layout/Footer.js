import React from "react";
import { withRouter } from "react-router-dom";
import khaltiImg from "../../../img/khalti.png";
import esewaImg from "../../../img/esewa.png";

function Footer() {
  return (
    <footer className="footer-section">
      {/* <div className="custom-shape-divider-top-1641986293">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div> */}
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="footer-left">
              <div className="footer-logo">
                <a href="#">HamroCloset</a>
              </div>
              <ul>
                <li>Address: Bharatpur, Chitwan</li>
                <li>Email: support@hamrocloset.com</li>
              </ul>
              <div className="footer-social">
                <a href="#">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa fa-pinterest"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-2 offset-lg-1">
            <div className="footer-widget">
              <h5>Customer Care</h5>
              <ul>
                <li>
                  <a href="/sellerrequest">How to sell</a>
                </li>
                <li>
                  <a href="/contactus">Contact Us</a>
                </li>
                <li>
                  <a href="returns-and-refunds">Returns & Refunds</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="footer-widget">
              <h5>Contacts & Agreements</h5>
              <ul>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/about-us">About Us</a>
                </li>
                <li>
                  <a href="/terms-and-conditions">Terms & Conditions</a>
                </li>
                <li>
                  <a href="/digital-payments">Digital Payments</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="newslatter-item">
              <h5>Join Our Newsletter Now</h5>
              <p>
                Get E-mail updates about our latest shop and special offers.
              </p>
              <form action="#" className="subscribe-form">
                <input type="text" placeholder="Enter Your Mail" />
                <button type="button">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-reserved">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="copyright-text">
                Copyright © 2022 All rights reserved |{" "}
                <a href="" target="_blank">
                  HamroCloset
                </a>
              </div>
              <div className="payment-pic">
                <img src={esewaImg} />
                <img src={khaltiImg} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default withRouter(Footer);
