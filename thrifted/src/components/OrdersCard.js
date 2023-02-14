import React, { useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiErrorNotification } from "./../global/Notification";
import { Oval } from "react-loader-spinner";

function OrdersCardSkeleton() {
  let arr = Array.apply(null, { length: 6 }).map(Number.call, Number);
  return arr.map((a) => {
    return <div key={a} className="skeleton skeleton-orderlistcard mb-3"></div>;
  });
}

function OrdersCard({ loading, transactions }) {
  const [selectedId, setSelectedId] = useState(0);
  if (loading) return <OrdersCardSkeleton />;

  const config = {
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  };

  async function generateInvoice(transaction_id) {
    setSelectedId(transaction_id);
    const data = {
      transaction_id,
    };
    try {
      const response = await axios.post(
        "/order/generate/invoice",
        data,
        config
      );
      window.location.href = response.data;
    } catch (error) {
      apiErrorNotification(error);
    }
    setSelectedId(0);
  }

  return transactions.map((transaction) => {
    return (
      <div className="orderlistcard">
        <div className="orderlistcard__title">
          <p id="AE980390454">Order No : {transaction._id}</p>
          <p className="date-fix-ar">{format(transaction.createdAt)}</p>
        </div>

        {transaction._id != selectedId ? (
          <button
            className="btn btn--orders-action"
            onClick={() => generateInvoice(transaction._id)}
          >
            <strong>Print Order</strong>
          </button>
        ) : (
          <button
            disabled
            className="btn btn--orders-action d-flex justify-content-center align-items-center"
          >
            <Oval
              height={16}
              width={16}
              strokeWidth={3}
              color="rebeccapurple"
              secondaryColor="#555"
            />
          </button>
        )}

        <div className="order-extra-information-block">
          {transaction.addresses.map((address) => {
            return address.type == "shipping" ? (
              <section
                className="order-info-text-block text-capitalize"
                id="OEIB-shipping "
              >
                <strong className="order-info-text-block__title">
                  Shipping Information:{" "}
                </strong>
                <p>
                  {address.street}, {address.city}, {address.district}
                </p>
                <p>
                  {transaction.user_id.name} | {address.phone}{" "}
                </p>
              </section>
            ) : (
              <section
                className="order-info-text-block  text-capitalize"
                id="OEIB-billing"
              >
                <strong className="order-info-text-block__title">
                  Billing Information:{" "}
                </strong>
                <p>
                  {address.street}, {address.city}, {address.district}
                </p>
                <p>
                  {transaction.user_id.name} | {address.phone}{" "}
                </p>
              </section>
            );
          })}

          <section className="order-info-text-block" id="OEIB-payment">
            <strong className="order-info-text-block__title">
              Payment Information:{" "}
            </strong>
            <p>
              {transaction.payment_method} (+Rs.{transaction.shipping})
            </p>
            <strong>Grand total: Rs.{transaction.total}</strong>
          </section>
        </div>
        {transaction.orders.map((order) => {
          return (
            <div className="orderinfo">
              {order.product_id ? (
                <div className="Product">
                  <div className="product-image">
                    <Link
                      to={`product-detail/${order.product_id._id}`}
                      className="d-block"
                    >
                      <img src={order.product_id.image} />
                    </Link>
                  </div>
                  <div className="product-info">
                    <p>{order.product_id.name}</p>
                    <div className="MetaData">
                      <p>Color : {order.color}</p>

                      <p>Quantity : {order.quantity}</p>
                      <p>ID : {order._id}</p>
                    </div>
                  </div>

                  <div className="product-size">
                    {order.size ? <p>{order.size}</p> : <p>OS</p>}
                  </div>
                  <div className="product-price">
                    <p>Rs.{order.price}</p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  });
}

export default OrdersCard;
