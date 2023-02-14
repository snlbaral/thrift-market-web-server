import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCartContext } from "../../../global/CartContext";
import AddAddress from "../address/AddAddress";
import EditAddress from "../address/EditAddress";
import CheckoutAddressCard from "./../../../components/CheckoutAddressCard";
import FormCardSkeleton from "../../../components/FormCardSkeleton";
import Select from "react-select";

function Checkout(props) {
  const { cart, subtotal, cartItems, config } = useCartContext();

  const [shippingAddress, setShippingAddress] = useState({});
  const [billingAddress, setBillingAddress] = useState({});
  const [sameBilling, setSameBilling] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState("branch");

  const [view, setView] = useState("address");
  const [shippingFee, setShippingFee] = useState(0);
  const [shippings, setShippings] = useState([]);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellerPickupLocations, setSellerPickupLocations] = useState([]);

  useEffect(() => {
    if (addresses.length) {
      try {
        var shipping = JSON.parse(localStorage.getItem("shipping"));
        var billing = JSON.parse(localStorage.getItem("billing"));
        var ship = addresses.find((address) => address._id == shipping._id);
        var bill = addresses.find((address) => address._id == billing._id);
        if (ship) {
          setShippingAddress(shipping);
        } else {
          setShippingAddress(addresses[0]);
        }
        if (bill) {
          setBillingAddress(billing);
        } else {
          setBillingAddress(addresses[0]);
        }
      } catch (error) {
        setShippingAddress(addresses[0]);
        setBillingAddress(addresses[0]);
      }
    }
  }, [addresses]);

  async function getAddress() {
    try {
      const response = await axios.get("/address", config);
      setAddresses(response.data);
    } catch (error) {}
    setLoading(false);
  }

  async function getShippingRates() {
    try {
      var sellers = [];
      cartItems.map((item) => {
        sellers.push(item.seller_id);
      });
      sellers = [...new Set(sellers)];
      const data = {
        sellers,
      };
      const resp = await axios.post(
        "/shipping/price-list/by-seller-ids",
        data,
        config
      );
      console.log(resp.data);
      setShippings(resp.data.shipping);

      setSellerPickupLocations(resp.data.locations);
    } catch (error) {}
  }

  useEffect(() => {
    if (cartItems.length) {
      getShippingRates();
    }
  }, [cartItems]);

  useEffect(() => {
    setView("address");
    getAddress();
  }, [props]);

  useEffect(() => {
    if (
      shippings.length &&
      shippingAddress?.district &&
      sellerPickupLocations.length
    ) {
      var shippingCharge = 0;
      sellerPickupLocations.map((location) => {
        var find = shippings.find(
          (ship) =>
            ship.to == shippingAddress.city && location.city == ship.from
        );
        if (find) {
          shippingCharge +=
            deliveryOption == "branch" ? find.branch : find.door;
        }
      });
      setShippingFee(shippingCharge);
    }
  }, [
    props,
    shippingAddress,
    shippings,
    sellerPickupLocations,
    deliveryOption,
  ]);

  function changebillingAddressress(e) {
    var address = addresses.find((address) => address._id == e.target.value);
    setBillingAddress(address);
  }

  function changeShippingAddress(e) {
    var address = addresses.find((address) => address._id == e.target.value);
    setShippingAddress(address);
  }

  useEffect(() => {
    if (shippingAddress && shippingAddress._id) {
      localStorage.setItem("shipping", JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (billingAddress && billingAddress._id) {
      localStorage.setItem("billing", JSON.stringify(billingAddress));
    }
  }, [billingAddress]);

  return (
    <main>
      <section className="pt-7 pb-12  py-5">
        <div className="col-12 text-center inner-header">
          <h3>Checkout</h3>
        </div>
        <div className="container">
          <div className="col-12 col-lg-10 offset-lg-1">
            <div className="row"></div>
          </div>

          <div className="row">
            <div className="row col-12 col-md-7 ">
              {loading ? (
                <FormCardSkeleton />
              ) : view == "address" ? (
                addresses.length ? (
                  <>
                    <div className="col-md-12">
                      <CheckoutAddressCard
                        address={shippingAddress}
                        addresses={addresses}
                        handleChange={changeShippingAddress}
                        title={"Shipping Address"}
                      />
                      <div className="d-flex checkout-sameshipping my-4 justify-content-between align-items-center ml-0 mr-0">
                        <div className="">Billing Address</div>
                        <div class="form-check ml-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck1"
                            defaultChecked={sameBilling}
                            onChange={() => setSameBilling(!sameBilling)}
                          />
                          <label class="form-check-label" for="defaultCheck1">
                            Same as Shipping
                          </label>
                        </div>
                      </div>

                      {!sameBilling && (
                        <CheckoutAddressCard
                          address={billingAddress}
                          addresses={addresses}
                          handleChange={changebillingAddressress}
                          title={"Billing Address"}
                        />
                      )}

                      <div className="checkout-sameshipping my-4 justify-content-between align-items-center ml-0 mr-0">
                        <label
                          class="form-check-label mb-2"
                          for="defaultCheck1"
                        >
                          Delivery Option
                        </label>

                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name="city"
                          defaultValue={{
                            label: "Pickup at Branch",
                            value: "branch",
                          }}
                          options={[
                            {
                              label: "Pickup at Branch",
                              value: "branch",
                            },
                            {
                              label: "Deliver to My Door",
                              value: "door",
                            },
                          ]}
                          placeholder="Select Deliver Option"
                          onChange={({ value }) => setDeliveryOption(value)}
                          required={true}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <AddAddress checkout={true} />
                )
              ) : (
                <EditAddress {...props} />
              )}
            </div>

            <div className="col-12 col-md-5 col-lg-4 offset-lg-1">
              <h6 className="mb-7">Order Items ({cart})</h6>

              <hr className="my-7" />

              <ul className="list-group list-group-lg list-group-flush-y list-group-flush-x mb-7">
                {cartItems.map((item) => {
                  return item.product_id ? (
                    <div>
                      <li className="list-group-item ">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <div className="checkout-image">
                              <img
                                src={item.product_id.image}
                                alt={item.product_id.name}
                              />
                            </div>
                          </div>
                          <div className="col checkout_orderitem">
                            <p className="mb-0 font-size-sm font-weight-bold">
                              <div className="text-body">
                                {item.product_id.name}
                              </div>
                              <span className="text-muted">
                                Rs.{item.price}
                              </span>
                            </p>

                            <div className="font-size-sm text-muted">
                              Size: {item.size}
                              <br />
                              Color: {item.color}
                            </div>
                          </div>
                        </div>
                        <hr />
                      </li>
                    </div>
                  ) : null;
                })}
              </ul>

              <div className="card mb-9  mb-5 order-card mt-4">
                <div className="card-body">
                  <ul className="list-group list-group-sm list-group-flush-y list-group-flush-x checkoutOrderList">
                    <li className="list-group-item d-flex">
                      <span>Subtotal</span>{" "}
                      <span className="ml-auto font-size-sm">
                        Rs. {subtotal}
                      </span>
                    </li>

                    <li className="list-group-item d-flex">
                      <span>Shipping</span>{" "}
                      <span className="ml-auto font-size-sm">
                        Rs {shippingFee}
                      </span>
                    </li>
                    <li className="list-group-item d-flex font-size-lg font-weight-bold">
                      <span>Total</span>{" "}
                      <span className="ml-auto">
                        Rs {subtotal + shippingFee}
                      </span>
                    </li>
                  </ul>
                  <p className="text-secondary  mt-4 mb-0">
                    Shipping and taxes calculated at checkout .
                  </p>
                  {!addresses.length || !cartItems.length ? (
                    <button
                      disabled
                      className="btn btn-secondary order-proceed mt-4"
                    >
                      <span className="d-block disabled">Proceed Payment</span>
                    </button>
                  ) : (
                    <div className="btn btn-secondary order-proceed mt-4">
                      <Link
                        to={{
                          pathname: "/payment",
                          state: {
                            shippingFee,
                            shippingAddress,
                            billingAddress,
                          },
                        }}
                        className="d-block"
                      >
                        Proceed Payment
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Checkout;
