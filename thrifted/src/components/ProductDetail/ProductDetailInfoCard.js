import React from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

function ProductDetailInfoCardSkeleton() {
  return (
    <div className="col">
      <div className="skeleton h-100 w-100"></div>
    </div>
  );
}

function ProductDetailInfoCard({
  product,
  stock,
  cartButton,
  buynow,
  loading,
}) {
  if (loading) return <ProductDetailInfoCardSkeleton />;
  return (
    <div className="col">
      <div className="container">
        <Link
          to={`/closet/${product.seller_id?._id}`}
          className="product-detail-userimg  position-relative"
        >
          <img className={product.seller_id?.image} />

          <div>
            <span className="text-capitalize">{product.seller_id?.name}</span>
            <div className="detail-date text-secondary">
              {format(product.createdAt)}
            </div>
          </div>
        </Link>

        <div className="d-flex justify-content-between align-items-center">
          <div className="detail-product-name">{product.name} </div>
          <div className="detail-product-type">{product.type}</div>
        </div>

        <div className="detail-brand-name">{product.brand_id?.name} </div>

        <div className="detail-product-price">
          Rs.{product.price}
          <span>Rs.{product.original}</span>
        </div>

        <div className="detail-product-size text-capitalize">
          {product.size_id ? product.size_id.name : null}
        </div>
        {stock > 0 ? (
          <>
            <button
              className="addtocart-btn"
              onClick={() => cartButton(product._id)}
            >
              ADD TO CART
            </button>
            <button className="buynow-btn" onClick={() => buynow(product._id)}>
              BUY NOW
            </button>
          </>
        ) : (
          <>
            <button className="addtocart-btn " disabled>
              OUT OF STOCK
            </button>
            <button className="buynow-btn" disabled>
              OUT OF STOCK
            </button>
          </>
        )}
      </div>

      <div className="product-collapse mt-5">
        <div id="accordion" className="accordion">
          <div className="card mb-0 border-0 rounded-0">
            <div
              className="card-header collapsed px-3"
              data-toggle="collapse"
              href="#collapseOne"
            >
              <a className="card-title">Product Details</a>
            </div>
            <div
              id="collapseOne"
              className="card-body collapse "
              data-parent="#accordion"
            >
              <ul>
                <p
                  className="post__content"
                  dangerouslySetInnerHTML={{ __html: product?.detail }}
                ></p>
              </ul>
            </div>

            {product.specifications ? (
              <div
                id="collapseTwo"
                className="card-body collapse"
                data-parent="#accordion"
              >
                <ul>
                  {product.description ? (
                    <p
                      className="post__content"
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    ></p>
                  ) : null}

                  {
                    // {product.specifications.map(specification=>{
                    //   return(
                    //     <li key={specification.id}>{specification.attribute_name}: {specification.value}</li>
                    //   )
                    // })}
                  }

                  <li>Color: {product.color}</li>
                </ul>
              </div>
            ) : null}

            <div
              className="card-header collapsed px-3"
              data-toggle="collapse"
              data-parent="#accordion"
              href="#collapseTwo"
            >
              <a className="card-title">Delivery & Returns</a>
            </div>
            <div id="collapseTwo" className="collapse" data-parent="#accordion">
              <div className="card-body">
                <p>
                  You have 14 days to place a FREE returns request if you change
                  your mind. Learn more about our returns process here.
                </p>
              </div>
            </div>

            <div
              className="card-header collapsed px-3"
              data-toggle="collapse"
              data-parent="#accordion"
              href="#collapseThree"
            >
              <a className="card-title">Delivery & Returns</a>
            </div>

            <div
              id="collapseThree"
              className="collapse"
              data-parent="#accordion"
            >
              <div className="card-body">
                <p>
                  You have 14 days to place a FREE returns request if you change
                  your mind. Learn more about our returns process here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailInfoCard;
