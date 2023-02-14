import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiErrorNotification } from "../global/Notification";
import $ from "jquery";

function OrderTrackModal({ item, orders, setOrders }) {
  const [message, setMessage] = useState("");
  const [order_status, setOrder_Status] = useState(item.order_status);

  const config = {
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  };

  async function addOrderTrackEvent(e, id) {
    e.preventDefault();
    try {
      const data = {
        user_id: item.user_id,
        seller_id: item.seller_id,
        transaction_id: item.transaction_id,
        message,
        order_id: item._id,
        product_id: item.product_id,
        order_status: order_status,
      };
      const response = await axios.post("/order-track/" + id, data, config);
      var neworders = [...orders];
      if (order_status === "completed") {
        neworders = neworders.filter((no) => no._id != item._id);
      } else {
        var orderfind = neworders.find((no) => no._id == item._id);
        if (orderfind) {
          orderfind.order_status = order_status;
        }
      }
      setOrders(neworders);
      $(".close-mdl-btn").click();
    } catch (error) {
      console.log(error.request.response);
      apiErrorNotification(error);
    }
  }

  return (
    <div
      class="modal fade"
      id={`exampleModal${item._id}`}
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content order-modal">
          <form onSubmit={(e) => addOrderTrackEvent(e, item._id)}>
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add Order Tracking Event
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {item.product_id?.name}

              <div className="form-group">
                <label>Event Detail</label>
                <textarea
                  className="form-control"
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Order Status</label>
                <select
                  className="form-control"
                  defaultValue={item.order_status}
                  onChange={(e) => setOrder_Status(e.target.value)}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary close-mdl-btn"
                data-dismiss="modal"
              >
                Close
              </button>
              <button class="btn btn-primary">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackModal;
