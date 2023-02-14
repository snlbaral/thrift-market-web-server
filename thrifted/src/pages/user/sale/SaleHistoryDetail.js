import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCartContext } from "../../../global/CartContext";
import PageLoading from "../../../global/PageLoading";
import { apiErrorNotification } from "./../../../global/Notification";
import moment from "moment";

function SaleHistoryDetail(props) {
  const [order, setOrder] = useState({});
  const [shippingAddress, setShippingAddress] = useState();
  const [loading, setLoading] = useState(false);
  const { config } = useCartContext();
  const [downloading, setDownloading] = useState(false);

  async function getOrderById() {
    try {
      setLoading(true);
      const response = await axios.get(
        "/order/sales/get/order/" + props.match.params.id,
        config
      );
      setOrder(response.data);
      if (response.data?.addresses && response.data.addresses.length) {
        const ship = response.data.addresses.find(
          (add) => add.type == "shipping"
        );
        if (ship) setShippingAddress(ship);
      }
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  useEffect(() => {
    getOrderById();
  }, []);

  async function generateShippingLabel() {
    setDownloading(true);
    const data = {
      order_id: order._id,
    };
    try {
      const response = await axios.post(
        "/order/generate/shipping-label",
        data,
        config
      );
      window.location.href = response.data;
    } catch (error) {
      apiErrorNotification(error);
    }
    setDownloading(false);
  }

  if (loading) return <PageLoading />;

  return (
    <div className="container-fluid p-5 w-75">
      <div className="sales-detail-container">
        <div className="row ">
          <div className="col-md-8 ">
            <div className="sale-order-detail-container row">
              <div className="col-md-2 sales-detail-image">
                <img src={order.product_id?.image} className="img-fluid" />
              </div>
              <div className="col-md-6">
                <div className="sale-title mb-1">{order.product_id?.name}</div>
                <div className="sale-feature">
                  <div>{order.brand}</div>
                  <span className="price mr-2">Rs.{order.price}</span>
                  <span className="size mr-2">| Size: {order.size}</span>
                  <span className="size">
                    | SKU : {order.product_id?.sku || "UNDEFINED"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="sale-title">Order Date :</div>
            <div className="sale-date-value">
              {moment(order.createdAt).format("DD MMM YYYY")}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="sale-product-container">
              <div className="row my-3">
                <div className="sale-product-title col-md-6">Price: </div>
                <div className="sale-product-value col-md-6">
                  Rs.{order.price}
                </div>
              </div>
              <div className="row my-3">
                <div className="sale-product-title col-md-6">Our Fees:</div>
                <div className="sale-product-value col-md-6">
                  Rs.{order.price - order.earning}
                </div>
              </div>
              <div className="row my-3">
                <div className="sale-product-title col-md-6">Your Earning:</div>
                <div className="sale-product-value col-md-6">
                  Rs.{order.earning}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="sale-title">Order ID: {order._id}</div>
            <div className="d-flex my-2">
              <div className="sale-date-value mr-2">Customer Name:</div>
              <div className="sale-date-value">{shippingAddress?.name}</div>
            </div>
            <div className="my-2">
              <div className="sale-date-value mr-2">Customer Address:</div>
              <div className="sale-date-value">
                {shippingAddress?.street},{shippingAddress?.city},
                {shippingAddress?.municipality},{shippingAddress?.district}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sales-detail-container mt-5">
        <div className="d-flex align-items-center justify-content-between mx-3 sale-status-boarder">
          <div className="sale-title text-capitalize">
            Order Status: {order.order_status}
          </div>
          {/* <div className="sale-status-btn">Problems/ Order Inquiry</div> */}
        </div>
        <div className="d-flex align-items-center justify-content-between mx-2">
          {downloading ? (
            <div className="sale-title download-shipping-label">
              Downloading...
            </div>
          ) : (
            <div
              className="sale-title download-shipping-label"
              onClick={() => generateShippingLabel()}
            >
              Download Shipping Label
            </div>
          )}
          {/* <div className="sale-status-btn">New Shipping Label</div> */}
        </div>
      </div>
    </div>
  );
}

export default SaleHistoryDetail;
