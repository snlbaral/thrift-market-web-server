import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import $ from "jquery";
import { format } from "timeago.js";
import ReactImageMagnify from "react-image-magnify";
import { useCartContext } from "../../../global/CartContext";
import CartHover from "../../../components/CartHover";
import { apiErrorNotification } from "./../../../global/Notification";
import ProductsCardSkeleton from "../../../components/ProductsCardSkeleton";
import ProductsCard from "../../../components/ProductsCard";
import ProductDetailImageCard from "../../../components/ProductDetail/ProductDetailImageCard";
import ProductDetailInfoCard from "../../../components/ProductDetail/ProductDetailInfoCard";

function ProductDetail(props) {
  const [product, setProduct] = useState([]);
  const [related, setRelated] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);

  const { addtocartButton, cartItems } = useCartContext();

  useEffect(() => {
    getData();
  }, [props]);

  async function getData() {
    try {
      const response = await axios.get(
        "/frontend/product-detail/" + props.match.params.id
      );
      var d = response.data.product.detail.split("\n");
      d = d.join("<br/>");
      var temp_prod = { ...response.data.product, detail: d };
      setProduct(temp_prod);
      setStock(response.data.product.stock);
      setRelated(response.data.related);
      setImageUrl(response.data.product.image);
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  useEffect(() => {
    if (cartItems && cartItems.length != 0) {
      var stockChange = cartItems.find(
        (stock) => stock.product_id?._id == product._id
      );
      if (stockChange) {
        var newStock = product.stock - stockChange.quantity;
        setStock(newStock);
      }
    }
  }, [props, cartItems, product]);

  function cartButton(pid) {
    addtocartButton(pid, 1);
  }

  function buynow(pid) {
    addtocartButton(pid, 1, "/checkout");
  }

  function changeImage() {
    const currentImage = document.querySelector("#currentImage");
    const images = document.querySelectorAll(".product-section-thumbnail");
    images.forEach((element) =>
      element.addEventListener("click", thumbnailClick)
    );
    function thumbnailClick(e) {
      console.log("foreach");
      currentImage.classList.remove("product-active");
      currentImage.addEventListener("transitionend", () => {
        currentImage.src = this.querySelector("img").src;
        currentImage.classList.add("product-active");
      });
      images.forEach((element) => element.classList.remove("product-selected"));
      this.classList.add("product-selected");
    }
  }

  return (
    <main>
      <div className="container py-5">
        <div class="row product-detail-row">
          <ProductDetailImageCard
            product={product}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            loading={loading}
          />

          <ProductDetailInfoCard
            product={product}
            stock={stock}
            cartButton={cartButton}
            buynow={buynow}
            loading={loading}
          />
        </div>
      </div>

      <div class="container-fluid py-5">
        <h3 className="newarrival mb-5 text-uppercase">Related Products</h3>

        <div class="row">
          {loading ? (
            <ProductsCardSkeleton counts={8} loading={loading} />
          ) : (
            <ProductsCard products={related} />
          )}
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
