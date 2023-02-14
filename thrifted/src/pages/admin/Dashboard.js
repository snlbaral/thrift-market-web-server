import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiErrorNotification } from "../../global/Notification";

function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [sales, setSales] = useState(0);
  const [products, setProducts] = useState(0);
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    stats();
  }, []);

  async function stats() {
    try {
      const response = await axios.get("/frontend/dashboard/stats");
      console.log(response.data);
      setOrders(response.data.orders);
      setProducts(response.data.products);
      setCustomers(response.data.customers);
      setSales(response.data.sales);
    } catch (error) {
      console.log(error.request.response);
      apiErrorNotification(error);
    }
  }
  return (
    <div className="content-wrapper">
      <div class="dash-cards">
        <div class="dash-card-single">
          <div>
            <h1>{customers}</h1>
            <span>Customers</span>
          </div>
          <div>
            <i class="fa fa-user"></i>
          </div>
        </div>

        <div class="dash-card-single">
          <div>
            <h1>{products}</h1>
            <span>Products</span>
          </div>
          <div>
            <i class="fa fa-product-hunt" aria-hidden="true"></i>
          </div>
        </div>

        <div class="dash-card-single">
          <div>
            <h1>{orders}</h1>
            <span>Orders</span>
          </div>
          <div>
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
          </div>
        </div>

        <div class="dash-card-single">
          <div>
            <h1>Rs.{sales}</h1>
            <span>Sales</span>
          </div>
          <div>
            <i class="fa fa-money" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
