import React, { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import KhaltiCheckout from "khalti-checkout-web";
import { useHistory } from "react-router-dom";
import esewaImg from "../../../img/esewa.png";
import khaltiImg from "../../../img/khalti.png";
import { useCartContext } from "../../../global/CartContext";
import {
  customSuccessNotification,
  apiErrorNotification,
  customErrorNotification,
} from "./../../../global/Notification";

function Payment(props) {
  const [note, setNote] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const history = useHistory();

  const { cart, cartItems, subtotal, setPageLoader, config } = useCartContext();

  useEffect(() => {
    if (!cartItems.length) {
      return props.history.push("/checkout");
    }
    if (
      !props.location.state?.shippingFee &&
      props.location.state?.shippingFee != 0
    ) {
      return props.history.push("/checkout");
    }
    if (!props.location.state?.shippingAddress) {
      return props.history.push("/checkout");
    }
    if (!props.location.state?.billingAddress) {
      return props.history.push("/checkout");
    }
    setShippingFee(props.location.state.shippingFee);
  }, [props]);

  function esewa() {
    setPageLoader(true);
    const data = {
      total: subtotal + shippingFee,
      shipping: shippingFee,
      note,
      transaction_id: uuidv4(),
      payment_method: "esewa",
      shipping_id: props.location.state.shippingAddress._id,
      billing_id: props.location.state.billingAddress._id,
    };
    localStorage.setItem("payment_data", JSON.stringify(data));
    //Development
    var path = "https://esewa.com.np/epay/main";
    var params = {
      amt: data.total,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: data.total,
      pid: uuidv4(),
      scd: "NP-ES-TMPVT",
      su: "https://hamrocloset.com/payment-success",
      fu: "https://hamrocloset.com/payment-failed",
    };

    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);
    for (var key in params) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
  }

  async function khaltiApi(payload) {
    setPageLoader(true);
    try {
      const data = {
        shipping_id: props.location.state.shippingAddress._id,
        billing_id: props.location.state.billingAddress._id,
        payment_method: "khalti",
        amount: payload.amount,
        token: payload.token,
        total: subtotal + shippingFee,
        shipping: shippingFee,
        note,
        transaction_id: uuidv4(),
      };
      await axios.post("/order", data, config);
      customSuccessNotification("Order placed success");
      history.push("/order-received");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  function khalti() {
    let config = {
      // replace this key with yours
      publicKey: "live_public_key_02955b93394c4c92a5d73f48b9bde60d",
      productIdentity: "1234567890",
      productName: "Ecommerce Product",
      productUrl: "http://localhost:3000",
      eventHandler: {
        onSuccess(payload) {
          console.log(payload);
          // hit merchant api for initiating verfication
          khaltiApi(payload);
          // if (payload.status == 200) {
          // } else {
          //   customErrorNotification("Payment Failed.");
          // }
        },
        // onError handler is optional
        onError(error) {
          console.log(error);
          customErrorNotification("Payment gateway error.");
          // handle errors
        },
        onClose() {},
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };
    let checkout = new KhaltiCheckout(config);
    // minimum transaction amount must be 10, i.e 1000 in paisa.
    checkout.show({ amount: (subtotal + shippingFee) * 100 });
  }

  return (
    <section className="pt-7 pb-12  py-5">
      <div className="col-12 text-center inner-header">
        <h3>Payment</h3>
      </div>
      <div className="container py-5">
        <div className="row justify-content-center checkgap">
          <div className="col-md-6">
            <div className="form-group">
              <label>Delivery Note</label>
              <textarea
                className="checknote w-100 p-3"
                onChange={(e) => setNote(e.target.value)}
                rows="5"
              >
                {" "}
              </textarea>
            </div>

            <div className="form-group">
              <h7 className="d-block font-weight-bold">Pay With</h7>
              <div className="d-flex mt-4 align-items-center ">
                <div
                  className="payment-method-img mr-4"
                  onClick={(e) => esewa(e)}
                >
                  <img src={esewaImg} className="img-fluid" />
                </div>

                <div className="payment-method-img" onClick={(e) => khalti(e)}>
                  <img src={khaltiImg} className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 pt-3 bg-white">
            <h7 className="font-weight-bold">Order Items ({cart})</h7>

            <hr />
            <div className="card bg-white border-0">
              <div className="card-body bg-white">
                {cartItems.map((item) => {
                  return item.product_id ? (
                    <main>
                      <div class="d-flex justify-content-between mb-3">
                        <div className="text-left">Product:</div>
                        <div className="float-right ml-5">
                          {item.product_id.name}
                        </div>
                      </div>

                      <div class="d-flex justify-content-between mb-3">
                        <div className="text-left">Quantity:</div>
                        <div className="text-right">{item.quantity}</div>
                      </div>

                      <div class="d-flex justify-content-between mb-3">
                        <div className="text-left">Price:</div>
                        <div className="text-right">Rs. {item.price}</div>
                      </div>

                      <hr />
                    </main>
                  ) : null;
                })}

                <div class="d-flex justify-content-between mb-3 font-weight-bold">
                  <div className="text-left">Sub Total:</div>
                  <div className="text-right">Rs. {subtotal}</div>
                </div>
                <div class="d-flex justify-content-between mb-3 font-weight-bold">
                  <div className="text-left">Shipping Fee:</div>
                  <div className="text-right">Rs. {shippingFee}</div>
                </div>
                <div class="d-flex justify-content-between mb-3 font-weight-bold">
                  <div className="text-left">Total:</div>
                  <div className="text-right">Rs. {subtotal + shippingFee}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Payment;
