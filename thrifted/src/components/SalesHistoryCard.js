import React from "react";
import { Link } from "react-router-dom";

function SalesHistoryCardSkeleton({ counts = 12 }) {
  let arr = Array.apply(null, { length: counts }).map(Number.call, Number);
  return arr.map((a) => (
    <div key={a} className="skeleton skeleton-sales-item-card"></div>
  ));
}

function SalesHistoryCard({ loading, sales }) {
  if (loading) return <SalesHistoryCardSkeleton />;
  return sales.map((item) => {
    return (
      <Link
        to={`/sale/detail/${item._id}`}
        className="row sales-item-card"
        key={item._id}
      >
        <div className="col-md-2 p-0">
          <div className="product-img">
            <img src={item.product_id?.image} className="img-fluid" />
          </div>
        </div>
        <div className="col-md-10">
          <div className="sale-item-title">{item.product_id?.name}</div>
          <div className="d-flex sale-item-wrapper  align-items-center">
            <div className="align-item-component   ">
              Rs.{item.price}
              <span>|</span>
            </div>
            <div className="align-item-component ">
              Size:{item.size}
              <span>|</span>
            </div>
            <div className="align-item-component ">
              Buyer {item.user_id?.name}
            </div>
          </div>
          <div className="sale-item-delivery">
            Order Status: {item.order_status}
          </div>
        </div>
      </Link>
    );
  });
}

export default SalesHistoryCard;
