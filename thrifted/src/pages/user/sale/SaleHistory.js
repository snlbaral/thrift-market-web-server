import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { useCartContext } from "../../../global/CartContext";
import SalesHistoryCard from "../../../components/SalesHistoryCard";
import { apiErrorNotification } from "./../../../global/Notification";

function SaleHistory(props) {
  const [items, setItems] = useState([]);
  const [totalSale, setTotalSale] = useState(0);

  const [pageno, setPageno] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [total, setTotal] = useState(12);

  const { config, currentUser } = useCartContext();
  const [loading, setLoading] = useState(true);

  async function getSalesData() {
    setLoading(true);
    try {
      const data = {
        pageno,
        itemsPerPage,
      };
      const response = await axios.post(
        "/order/sales/pagination",
        data,
        config
      );
      console.log(response.data);
      setItems(response.data.orders);
      setTotalSale(response.data.totalSales);
      setTotal(response.data.total);
    } catch (error) {
      apiErrorNotification(error);
    }
    setLoading(false);
  }

  const scrollTop = () => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // paginate
  useEffect(() => {
    getSalesData();
  }, [props, pageno]);

  function paginate(value) {
    setPageno(value);
    scrollTop();
  }

  return (
    <section className=" pb-12 ">
      <section className="mt-4 mb-5 py-1 salesDetail">
        <div className="row align-items-center justify-content-end">
          <div className="col-md-3 sales-value">
            <h6>Total Sale</h6>
            <p>Rs. {totalSale}</p>
          </div>
          <div className="col-md-3 sales-value">
            <h6>Total Sold Items</h6>
            <p>{total}</p>
          </div>
          <div className="col-md-3 sales-value">
            <h6>Available Amount</h6>
            <p>Rs. {currentUser.balance}</p>
          </div>
        </div>
      </section>
      <h5 className="card-body py-0 my-0 bg-white m-0">Sale History</h5>
      <SalesHistoryCard sales={items} loading={loading} />

      <div className="container pb-5">
        <Pagination
          activePage={pageno}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={total}
          pageRangeDisplayed={5}
          onChange={(e) => paginate(e)}
          itemClass="page-item "
          linkClass="page-link"
        />
      </div>
    </section>
  );
}

export default SaleHistory;
