import React from "react";

function ProductsCardSkeleton({ counts }) {
  let arr = Array.apply(null, { length: counts }).map(Number.call, Number);
  return arr.map((a) => {
    return (
      <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6 mb-4" key={a}>
        <div class="skeleton card border-0 newarrival-card">
          <div className="h-70"></div>
          <div className="home-product-skeleton pt-1 bg-white h-30">
            <span class="skeleton product-item-skeleton"></span>
            <span class="skeleton product-item-skeleton"></span>
            <span class="skeleton product-item-skeleton"></span>
          </div>
        </div>
      </div>
    );
  });
}

export default ProductsCardSkeleton;
