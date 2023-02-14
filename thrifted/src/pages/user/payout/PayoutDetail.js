import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { format } from "timeago.js";
import DataTable from "react-data-table-component";
import { Oval } from "react-loader-spinner";
import "../../../App.css";
import { useCartContext } from "../../../global/CartContext";
import { apiErrorNotification } from "./../../../global/Notification";

function PayoutDetail(props) {
  const [withdraw, setWithdraw] = useState([]);
  const [is_loader, setIs_loader] = useState(true);
  const { config } = useCartContext();
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, [props]);

  const scrollTop = () => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handlePageChange = (page) => {
    getData(page);
    scrollTop();
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    scrollTop();
    setIs_loader(true);
    const data = {
      pageno: page,
      perPage: newPerPage,
    };
    const response = await axios.post(
      "/user/withdraw/pagination",
      data,
      config
    );
    setWithdraw(response.data.withdraw);
    setTotalRows(response.data.total);
    setPerPage(newPerPage);
    setIs_loader(false);
  };

  useEffect(() => {
    getData(1);
  }, [props]);

  async function getData(pageno = 1) {
    setIs_loader(true);
    try {
      const data = {
        pageno,
        perPage,
      };
      const response = await axios.post(
        "/user/withdraw/pagination",
        data,
        config
      );
      setWithdraw(response.data.withdraw);
      setTotalRows(response.data.total);
    } catch (error) {
      apiErrorNotification(error);
    }
    setIs_loader(false);
  }

  const columns = [
    {
      name: <th>Seller</th>,
      selector: (item) => item.seller_id?.name,
      sortable: true,
    },
    {
      name: <th>Payment Method</th>,
      selector: (item) => item.payment_method,
      sortable: true,
    },
    {
      name: <th>Account Detail</th>,
      selector: (item) => item.account_detail,
      sortable: true,
    },
    {
      name: <th>Amount</th>,
      selector: (item) => item.amount,
      sortable: true,
    },
    {
      name: <th>Status</th>,
      selector: (item) => item.status,
      sortable: true,
    },
    {
      name: <th>Date</th>,
      selector: (item) => format(item.createdAt),
      sortable: true,
    },
  ];

  return (
    <div className="container  mx-auto">
      <DataTable
        columns={columns}
        data={withdraw}
        pagination
        title="Payout Detail"
        progressPending={is_loader}
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
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
  );
}

export default withRouter(PayoutDetail);
