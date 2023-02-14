import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AddContext, useCartContext } from "../../../global/CartContext";
import axios from "axios";
import NotificationManager from "react-notifications/lib/NotificationManager";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";
import EmptyCart from "../../../components/EmptyCart";

function CartItems(props) {
  const { cartItems, subtotal, retotal, setPageLoader, config } =
    useCartContext();

  async function distroy(id, q) {
    setPageLoader(true);
    try {
      await axios.delete("/addtocart/cartremove/" + id, config);
      var xyz = cartItems.filter((item) => item._id != id);
      retotal(xyz);
      customSuccessNotification("Product removed from cart");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  // async function testApi() {
  //   console.log("start");
  //   try {
  //     const config2 = {
  //       headers: {
  //         Authorization: "Token f6fe2f12ebf5595d62887f8968df969360b98c0e",
  //       },
  //     };
  //     console.log("heyy");
  //     const data = {
  //       name: "demo",
  //       phone: "9845534063",
  //       cod_charge: 0,
  //       address: "Byas Pokhari",
  //       branch: "CHITWAN",
  //       fbranch: "Hetauda",
  //       delivery_type: "Door2Branch",
  //     };
  //     console.log("data", data);
  //     const response = await axios.post(
  //       "https://demo.nepalcanmove.com/api/v1/order/create",
  //       data,
  //       config2
  //     );

  //     console.log("response", response.data);
  //   } catch (error) {
  //     console.log("testt");
  //     console.log("error", error.request.response);
  //   }
  // }

  return (
    <div className="card-section py-5">
      <div className="cart_title  text-center text-uppercase inner-header">
        Shopping Cart{" "}
      </div>
      <div className="container-fluid">
        {!cartItems.length ? (
          <EmptyCart link="/" title="Go Home" />
        ) : (
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="cart_container">
                <div className="cart_buttons">
                  <Link className="btn-checkshop" to="/">
                    Continue Shopping
                  </Link>
                  <Link className="btn-buynow btncheckout" to="/checkout">
                    Checkout
                  </Link>
                </div>

                <div class="kms_product_overview">
                  <div class="kms_product_overview__tbody">
                    <div class="kms_product_overview__thead">
                      <div class="kms_product_overview__th">Item</div>
                      <div class="kms_product_overview__th">Name</div>
                      <div class="kms_product_overview__th">Color</div>

                      <div class="kms_product_overview__th">Size</div>
                      <div class="kms_product_overview__th">Quantity</div>
                      <div class="price_column kms_product_overview__th">
                        Price
                      </div>
                      <div className="kms_product_overview__th">Total</div>
                      <div class="kms_product_overview__th">Action</div>
                    </div>

                    {cartItems.map((item) => {
                      return item.product_id ? (
                        <div class="kms_product_overview__tr product-overview">
                          <div class="row_container kms_product_overview__td">
                            <div class="kms_product">
                              <div class="kms_product__tr">
                                <div class="kms_product__td cartimggg">
                                  <img
                                    src={item.product_id.image}
                                    className="img-fluid"
                                  />
                                </div>

                                <div class="kms_product__td">
                                  <div>
                                    <p class="kms_product__brand-name">
                                      {item.product_id.name}
                                    </p>
                                  </div>
                                </div>

                                <div class="kms_product__td">
                                  <div>
                                    <p class="kms_product__brand-name">
                                      {item.color}
                                    </p>
                                  </div>
                                </div>

                                <div class="kms_product__td">{item.size}</div>

                                <div class="kms_product__td">
                                  <div>
                                    <p class="kms_product__brand-name">
                                      {item.quantity}
                                    </p>
                                  </div>
                                </div>

                                <div class="price_column kms_product__td">
                                  <span class="">Rs.{item.price}</span>
                                </div>
                                <div className="kms_product__td">
                                  Rs.{item.price * item.quantity}
                                </div>
                                <div class="kms_product__td">
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      distroy(item._id, item.quantity)
                                    }
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="order_total">
                  <div className="order_total_content text-md-right">
                    <div className="order_total_title font-weight-bold">
                      Order Total:
                    </div>
                    <div className="order_total_amount">Rs.{subtotal}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartItems;
