import React, { useContext, useEffect, useState } from "react";
import IMG from "../../img/contactus.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCartContext } from "../../global/CartContext";
import {
  customSuccessNotification,
  apiErrorNotification,
} from "./../../global/Notification";

function ContactUs(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const { setPageLoader } = useCartContext();

  async function contact(e) {
    e.preventDefault();
    const data = {
      name,
      email,
      message,
      subject,
    };
    setPageLoader(true);
    try {
      await axios.post("/user/contact/form", data);
      customSuccessNotification("Thank you for contacting us.");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  return (
    <div className="container-fluid">
      <div className="img-div">
        <img src={IMG} className="img-fluid" />
        <div className="question">
          <h3>We're here to help you!</h3>
        </div>
      </div>
      <div className="contact-wrapper">
        <h3>Get In Touch</h3>
        <div className="row">
          <div className="col-md-6 contact-detail">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              ut dignissimos debitis esse quia? Reprehenderit?
            </p>
            <form onSubmit={(e) => contact(e)}>
              <div className="form-group row ">
                <div className="col-md-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="subject"
                />
              </div>
              <div className="form-group">
                <textarea
                  type="text"
                  className="checknote w-100 p-3"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="message"
                  rows={3}
                ></textarea>
              </div>
              <button className="btn order-proceed w-25">Submit</button>
            </form>
          </div>
          <div className="col-md-6">
            <img src="https://i.imgur.com/jaeBKnc.png" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
