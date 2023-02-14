import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import Pagination from "react-js-pagination";

import { NotificationManager } from "react-notifications";
import { useCartContext } from "../../../global/CartContext";
import OrdersCard from "../../../components/OrdersCard";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";
import { load } from "dotenv";
import EmptyOrder from "../../../components/EmptyOrder";

function OrderList(props) {
  const { config } = useCartContext();

  const [items, setItems] = useState([]);

  const [pageno, setPageno] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [total, setTotal] = useState(6);

  const [loading, setLoading] = useState(true);

  async function getTransactions() {
    setLoading(true);
    try {
      const data = {
        pageno,
        itemsPerPage,
      };
      const response = await axios.post(
        "/order/transaction/pagination",
        data,
        config
      );
      setTotal(response.data.total);
      setItems(response.data.transactions);
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  function ordercancel() {}

  const scrollTop = () => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // paginate
  useEffect(() => {
    getTransactions();
  }, [props, pageno]);

  function paginate(value) {
    setPageno(value);
    scrollTop();
  }

  return (
    <div className="cart_section pt-0">
      <div className="card-body py-0 bg-white">
        <h5>Your Orders</h5>
      </div>
      {!items.length && !loading ? (
        <EmptyOrder />
      ) : (
        <>
          <div className="container">
            <OrdersCard transactions={items} loading={loading} />;
          </div>

          <Pagination
            activePage={pageno}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={(e) => paginate(e)}
            itemClass="page-item mt-5"
            linkClass="page-link"
          />
        </>
      )}
    </div>
  );
}

export default OrderList;
