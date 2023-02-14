import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiErrorNotification } from "../../../global/Notification";

import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import { Oval } from "react-loader-spinner";
import OrderTrackModal from "../../../components/OrderTrackModal";

function OrderTrackIndex() {
  const [orders, setOrders] = useState([]);
  const [is_loader, setIs_loader] = useState(true);
  const [deleteId, setDeleteId] = useState(0);

  const config = {
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    try {
      const response = await axios.get("/order/pending/order", config);
      setOrders(response.data);
      setIs_loader(false);
    } catch (error) {}
  }

  const columns = [
    {
      name: <th>Image</th>,
      cell: (item) => (
        <>
          <img src={item.product_id?.image} className="py-2" width={70} />
        </>
      ),
    },

    {
      name: <th>Name</th>,
      selector: (item) => item.product_id?.name,
      sortable: true,
    },

    {
      name: <th>Order Id</th>,
      selector: (item) => item._id,
      sortable: true,
      grow: 3,
    },
    {
      name: <th>Transaction Id</th>,
      selector: (item) => item.transaction_id,
      sortable: true,
      grow: 3,
    },

    {
      name: <th>Order Status</th>,
      selector: (item) => item.order_status,
      sortable: true,
    },
    {
      name: <th>Seller</th>,
      selector: (item) => item.seller_id?.name,
      sortable: true,
    },
    {
      name: <th>User</th>,
      selector: (item) => item.user_id?.name,
      sortable: true,
    },
    {
      name: <th>Action</th>,
      cell: (item) => (
        <>
          <button
            className="btn btn-primary btn-sm mr-3"
            to=""
            data-toggle="modal"
            data-target={`#exampleModal${item._id}`}
          >
            New Order Tracking
          </button>
          <OrderTrackModal item={item} orders={orders} setOrders={setOrders} />
        </>
      ),
      grow: 3,
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="container-fluid px-5 mt-5 ">
        <DataTable
          columns={columns}
          data={orders}
          pagination
          progressPending={is_loader}
          progressComponent={
            <Oval
              height="40"
              width="40"
              color="#590696"
              ariaLabel="loading"
              secondaryColor="#ddd"
              strokeWidth={4}
              wrapperStyle={{ marginBottom: "50px" }}
            />
          }
        />
      </div>
    </div>
  );
}

export default OrderTrackIndex;
