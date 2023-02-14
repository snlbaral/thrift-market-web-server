import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import $ from "jquery";
import Pagination from "react-js-pagination";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { useCartContext } from "../../../global/CartContext";
import CartHover from "../../../components/CartHover";
import ProductsCardSkeleton from "../../../components/ProductsCardSkeleton";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";
import NoResult from "../../../components/NoResult";

function Closet(props) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [sorting, setSorting] = useState("-_id");

  const [pageno, setPageno] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [total, setTotal] = useState(24);

  const { config, currentUser, setPageLoader } = useCartContext();
  const [loading, setLoading] = useState(true);

  async function getClosetData() {
    setLoading(true);
    const data = {
      pageno,
      sorting,
    };
    try {
      const response = await axios.post(
        "/frontend/closet/" + props.match.params.id,
        data
      );
      setProducts(response.data.product);
      setUser(response.data.user);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  useEffect(() => {
    getClosetData();
  }, [props, pageno, sorting]);

  function closetSort(e) {
    if (e.target.value == "date") {
      setSorting("-_id");
    }
    if (e.target.value == "alphabet") {
      setSorting("name");
    }
  }

  async function profileimg(e) {
    setPageLoader(true);
    const data = new FormData();
    data.append("image", e.target.files[0]);
    try {
      const response = await axios.post(
        "/user/change/profileimg",
        data,
        config
      );
      $(".changeimage").attr("src", response.data);
      customSuccessNotification("Profile Image Updated");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  async function coverimg(e) {
    setPageLoader(true);
    const data = new FormData();
    data.append("cover", e.target.files[0]);
    try {
      const response = await axios.post("/user/closet/cover", data, config);
      $(".profile-wrapper").css("background-image", `url('${response.data}')`);
      customSuccessNotification("Cover Image Updated");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  const scrollTop = () => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // paginate
  function paginate(value) {
    setPageno(value);
    scrollTop();
  }

  return (
    <div className="container closet-container">
      {!user ? (
        <div className="skeleton skeleton-closet-user"></div>
      ) : (
        <section className="closet-user">
          <div
            className="profile-wrapper"
            style={{ backgroundImage: "url('" + user.cover + "')" }}
          >
            <label for="coverImg" className="coverImg-label">
              <i className="fa fa-camera"></i>
            </label>
            <input
              type="file"
              id="coverImg"
              className="d-none"
              onChange={(e) => coverimg(e)}
            />
          </div>
          <div className="closet-mypic">
            <label for="profileImg" className="profileImg-label">
              <i className="fa fa-camera"></i>
            </label>
            <input
              type="file"
              id="profileImg"
              className="d-none"
              onChange={(e) => profileimg(e)}
            />
            <img className="changeimage" src={user.image} />
          </div>
          <div className="closet-username">
            <h5>{user.name}</h5>
            <span>{user.email}</span>
          </div>
        </section>
      )}

      <hr />
      {!products.length && !loading ? (
        <NoResult title="Add Post" link="/create-post" />
      ) : (
        <section className="closet">
          <div className="closet-sort align-items-center">
            <div className="sort-by">Sort By :</div>
            <select
              className="ml-2 py-1 px-2 sortbotton"
              onChange={(e) => closetSort(e)}
            >
              <option value="date">Date</option>
              <option value="alphabet">Alphabet</option>
            </select>
          </div>
          <div className="row mt-3">
            {loading ? (
              <ProductsCardSkeleton counts={24} />
            ) : (
              products.map((product) => {
                return (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={product._id}>
                    <div className="card closet-card">
                      <Link to={`/product-detail/${product._id}`}>
                        <figure className="product-image-container">
                          <img src={product.image} />
                          <CartHover product_id={product._id} />
                        </figure>
                        <div className="closet-product-detail">
                          <div className="d-flex justify-content-between">
                            <div className="text-truncate">{product.name}</div>
                            <div className="closet-product-type">
                              {product.type}
                            </div>
                          </div>
                          {product.brand_id ? (
                            <div>{product.brand_id.name}</div>
                          ) : null}

                          <div className="font-weight-bold">
                            Rs.{product.price}
                          </div>
                          {product.size_id ? (
                            <div className="closet-size">
                              Size:{product.size_id.name}
                            </div>
                          ) : null}
                        </div>
                      </Link>

                      <div className="closet-detail-userimg">
                        <img
                          className="img-fluid"
                          src={product.seller_id?.image}
                        />
                        <span>{product.seller_id?.name}</span>
                        {currentUser._id == props.match.params.id ? (
                          <Link to={`/edit-post/${product._id}`}>
                            <i
                              class="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <Pagination
            activePage={pageno}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={(e) => paginate(e)}
            itemClass="page-item"
            linkClass="page-link"
          />
        </section>
      )}
    </div>
  );
}

export default Closet;
