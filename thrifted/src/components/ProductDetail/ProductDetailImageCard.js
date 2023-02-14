import React from "react";
import ReactImageMagnify from "react-image-magnify";

function ProductDetailImageCardSkeleton() {
  return (
    <div className="col">
      <div className="slider row">
        <div className="w-25">
          <div className="skeleton product-detail-side-image-skeleton"></div>
          <div className="skeleton product-detail-side-image-skeleton"></div>
          <div className="skeleton product-detail-side-image-skeleton"></div>
          <div className="skeleton product-detail-side-image-skeleton"></div>
        </div>
        <div className="skeleton product-detail-main-image-skeleton"></div>
      </div>
    </div>
  );
}

function ProductDetailImageCard({ product, setImageUrl, imageUrl, loading }) {
  if (loading) return <ProductDetailImageCardSkeleton />;
  return (
    <div className="col">
      <div className="slider row">
        <div className="product col">
          <figure className="side_figureimage">
            <img
              src={product.image}
              alt=""
              className="img-fluid d-block"
              onClick={() => setImageUrl(product.image)}
            />
          </figure>
          {product.feature_image && product.feature_image != 0
            ? product.feature_image.map((image) => {
                return (
                  <figure className="side_figureimage">
                    <img
                      src={image}
                      alt=""
                      className="img-fluid d-block"
                      onClick={() => setImageUrl(image)}
                    />
                  </figure>
                );
              })
            : null}
        </div>
        <div className="preview col-md-9 col">
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: "Wristwatch by Ted Baker London",
                isFluidWidth: true,
                src: imageUrl,
              },
              largeImage: {
                src: imageUrl,
                width: 1200,
                height: 1800,
              },
              style: {
                zIndex: 999,
              },
              className: "img-fluid active-img imagebox ",
              shouldUsePositiveSpaceLens: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailImageCard;
