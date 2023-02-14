import React, { useState } from "react";

function PricesFilterSkeleton({ counts = 8 }) {
  let arr = Array.apply(null, { length: counts }).map(Number.call, Number);
  return arr.map((a) => (
    <div key={a} className="skeleton category-filter-name"></div>
  ));
}

function PricesFilter({ loading = false, prices, priceChange }) {
  if (loading) return <PricesFilterSkeleton />;
  return prices.map((price, index) => {
    return (
      <div className="filters" key={price.maxprice}>
        <div className="form-group form-check mb-1">
          <input
            type="checkbox"
            className="form-check-input d-none"
            onChange={() => priceChange(price.minprice, price.maxprice)}
            id={`price${index}`}
          />
          <label
            htmlFor={`price${index}`}
            className="category-checkbox"
          ></label>
          <label className="form-check-label ml-1" htmlFor="Check1">
            Rs. {price.minprice} - Rs.{price.maxprice}
          </label>
        </div>
      </div>
    );
  });
}

export default PricesFilter;
