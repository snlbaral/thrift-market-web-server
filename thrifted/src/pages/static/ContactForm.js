import React from "react";

function ContactForm(props) {
  return (
    <div className="container w-50 max-auto py-5">
      <div className="contact-form-container">
        <p>
          <strong>Contact ...... Support</strong>
        </p>
        <form className="contact-form">
          <div class="row mb-9 mx-auto pb-4">
            <div class="col-12 col-md-6">
              <div className="form-group mb-0">
                <label className="">Your Name</label>
                <input
                  type="text"
                  className=" d-block w-100 form-control "
                  name="name"
                  required
                />
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div className="form-group">
                <label className="">Your Email</label>
                <input
                  class="form-control form-control-sm"
                  type="email"
                  name="email"
                  required
                />
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label for="checkoutBillingCountry">Category (required):</label>
                <select
                  className=" d-block w-100 form-control -add "
                  name="category"
                  required
                >
                  <option value="">Please Select Category</option>
                  <option value="tracking">Tracking or Delivery Problem</option>
                  <option value="payment">Payment Issue</option>
                  <option value="order">Problem with existing Order</option>
                  <option value="seller">Seller Earnings</option>
                  <option value="account">Account</option>
                </select>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label for="checkoutBillingCountry">Subject (required):</label>
                <input
                  class="form-control form-control-sm"
                  id="checkoutBillingCountry"
                  name="subject"
                  type="text"
                  required
                />
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label for="checkoutBillingCountry">Message (required):</label>
                <textarea
                  class="form-control form-control-sm"
                  id="checkoutBillingCountry"
                  name="message"
                  type="text"
                  rows="4"
                  required
                />
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label for="checkoutBillingCountry">File Attachment:</label>
                <input
                  type="file"
                  class="form-control form-control-sm"
                  id="checkoutBillingCountry"
                  name="files"
                  required
                />
              </div>
            </div>
          </div>

          <div class="col-12">
            <button type="submit" className="btn  order-proceed mt-3 w-25">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
