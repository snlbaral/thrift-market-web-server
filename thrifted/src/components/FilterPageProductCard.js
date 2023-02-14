import React from "react";
import { Link } from "react-router-dom";
import CartHover from "./CartHover";

function FilterPageProductCard({ product }) {
  return (
    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6 mb-3">
      <div class="card cate-page-card border-0">
        <figure class="product-image-container">
          <Link className="image-figure" to={`/product-detail/${product._id}`}>
            <div className="image-figure">
              <img
                className="image-figure-img"
                width="100%"
                height="100%"
                src={product.image}
                alt={product.name}
              />
            </div>
          </Link>
          <CartHover product_id={product._id} />
        </figure>
        <div className="card-body pt-1">
          <div class="product-bottom-info">
            <Link to={`/product-detail/${product._id}`}>
              <div class="product-bottom-info-thrifted">
                <div class="product-name text-capitalize text-truncate">
                  {product.name}
                </div>
                <div class="brand-container-thrifted">
                  {product.brand_id ? (
                    <div class="brand-name text-capitalize">
                      {product.brand_id.name}
                    </div>
                  ) : null}
                </div>
              </div>

              <div class="price-container">
                <span class="product-price">
                  <span class="currency">Rs.</span>
                  <strong>{product.price}</strong>
                </span>
                {/* {product.discount ? (
                  <div class="price-old-container">
                    <div class="price-old">
                      <span class="oldPrice">Rs.{product.price}</span>
                    </div>
                    <div class="discount-per">
                      <span class="value">{product.discount}% Off</span>
                    </div>
                  </div>
                ) : null} */}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPageProductCard;
