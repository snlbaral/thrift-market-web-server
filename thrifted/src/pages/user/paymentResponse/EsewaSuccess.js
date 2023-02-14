import axios from "axios";
import React, { useEffect } from "react";
import { useCartContext } from "../../../global/CartContext";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "../../../global/Notification";
import PageLoading from "../../../global/PageLoading";

function EsewaSuccess(props) {
  const { config } = useCartContext();

  useEffect(() => {
    paymentVerification();
  }, []);

  async function paymentVerification() {
    try {
      const amount = new URLSearchParams(props.location.search).get("amt");
      const ref_id = new URLSearchParams(props.location.search).get("refId");
      const payload = JSON.parse(localStorage.getItem("payment_data"));
      const pid = new URLSearchParams(props.location.search).get("oid");
      const data = {
        shipping_id: payload.shipping_id,
        billing_id: payload.billing_id,
        payment_method: "esewa",
        amt: amount,
        rid: ref_id,
        pid: pid,
        total: payload.total,
        shipping: payload.shipping,
        note: payload.note,
        transaction_id: payload.transaction_id,
      };
      await axios.post("/order", data, config);
      customSuccessNotification("Order placed success");
      props.history.push("/order-received");
    } catch (error) {
      apiErrorNotification(error);
      props.history.push("/payment-failed");
    }
  }
  return <PageLoading />;
}

export default EsewaSuccess;
