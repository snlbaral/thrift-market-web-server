import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { NotificationManager } from "react-notifications";
import $ from "jquery";
import { useCartContext } from "../../../global/CartContext";
import Select from "react-select";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";

function Payouts(props) {
  const [payment_method, setPayment_method] = useState("");
  const [account_detail, setAccountdetail] = useState("");
  const history = useHistory();

  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);

  const { config, setPageLoader } = useCartContext();

  async function withdraw(e) {
    setPageLoader(true);
    e.preventDefault();
    const data = {
      balance,
      payment_method,
      account_detail,
    };
    try {
      await axios.post("/user/withdraw", data, config);
      customSuccessNotification("Payout request success");
      history.push("/profile/withdraw-detail");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  return (
    <section>
      <div className="col-md-12 justify-content-center mx-auto payout-container">
        <div className="card-body py-0">
          <h5>Payouts</h5>
        </div>
        <div className="card  payment-card">
          <div className="card-body ">
            <form onSubmit={(e) => withdraw(e)} id="payoutform">
              <div className="form-group">
                <label>Select Payment Method</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={null}
                  options={[
                    {
                      label: "Esewa",
                      value: "esewa",
                    },
                    {
                      label: "Khalti",
                      value: "khalti",
                    },
                  ]}
                  placeholder="Select Payment Method"
                  onChange={({ value }) => setPayment_method(value)}
                  name="payment"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Account Number/Id</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setAccountdetail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Enter Amount For Withdraw</label>
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) => setBalance(e.target.value)}
                  name="balance"
                  required
                />
              </div>

              <button className="order-proceed w-25 border-0 mt-3">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Payouts;
