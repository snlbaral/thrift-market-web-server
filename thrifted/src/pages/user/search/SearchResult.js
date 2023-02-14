import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { AddContext, useCartContext } from "../../../global/CartContext";
import CartHover from "../../../components/CartHover";
import CategoriesFilter from "../../../components/CategoriesFilter";
import BrandsFilter from "../../../components/BrandsFilter";
import ColorsFilter from "../../../components/ColorsFilter";
import PricesFilter from "../../../components/PricesFilter";
import ProductsCardSkeleton from "../../../components/ProductsCardSkeleton";
import FilterPageProductCard from "../../../components/FilterPageProductCard";
import { apiErrorNotification } from "./../../../global/Notification";
import NoResult from "../../../components/NoResult";

function SearchResult(props) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [brand_id, setBrand_id] = useState([]);
  const [color_id, setColor_id] = useState([]);
  const [minprice, setMinprice] = useState([]);
  const [maxprice, setMaxprice] = useState([]);
  const [category_id, setCategory_id] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState(false);

  const [pageno, setPageno] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(12);

  const [loading, setLoading] = useState(true);
  const [initLoading, setInitLoading] = useState(true);

  const { addtocartButton } = useCartContext();

  const prices = [
    {
      minprice: 0,
      maxprice: 1000,
    },
    {
      minprice: 1000,
      maxprice: 2000,
    },
    {
      minprice: 2000,
      maxprice: 5000,
    },
    {
      minprice: 5000,
      maxprice: 8000,
    },
    {
      minprice: 8000,
      maxprice: 10000,
    },
    {
      minprice: 10000,
      maxprice: 15000,
    },
  ];

  useEffect(() => {
    getSidebarData();
  }, [props]);

  async function getSidebarData() {
    try {
      const response = await axios.get("/frontend/search-sidebar");
      setColors(response.data.color);
      setBrands(response.data.brand);
      setCategories(response.data.category);
      setInitLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  useEffect(() => {
    var q = props.location.search;
    q = q.replace("%20", " ");
    if (!q) {
      props.history.push("/");
      return false;
    }
    q = q.replace("?q=", "");
    setSearchQuery(q);
    getProduct(q);
  }, [props]);

  async function getProduct(q = searchQuery) {
    setLoading(true);
    const data = {
      search: q,
    };
    try {
      const response = await axios.post("/frontend/search-request", data);
      var x = response.data.filter(
        (v, i, a) => a.findIndex((t) => t._id === v._id) === i
      );
      setProducts(x);
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  async function getFilterProduct(catid, bid, cid, min, max) {
    setLoading(true);
    var data = {
      brand_id: bid,
      color_id: cid,
      minprice: min,
      maxprice: max,
      category_id: catid,
      search: searchQuery,
    };
    try {
      const response = await axios.post("/frontend/search-filter", data);
      var x = response.data.filter(
        (v, i, a) => a.findIndex((t) => t._id === v._id) === i
      );
      setProducts(x);
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  function brand_filter(id) {
    if (brand_id.includes(id)) {
      var x = brand_id.filter((br) => br != id);
      setBrand_id(x);
      getFilterProduct(category_id, x, color_id, minprice, maxprice);
    } else {
      var b = [...brand_id, id];
      setBrand_id(b);
      getFilterProduct(category_id, b, color_id, minprice, maxprice);
    }
  }

  function color_filter(id) {
    if (color_id.includes(id)) {
      var y = color_id.filter((c) => c != id);
      setColor_id(y);
      getFilterProduct(category_id, brand_id, y, minprice, maxprice);
    } else {
      var z = [...color_id, id];
      setColor_id(z);
      getFilterProduct(category_id, brand_id, z, minprice, maxprice);
    }
  }

  function priceChange(min, max) {
    if (minprice.includes(min) && maxprice.includes(max)) {
      var x = minprice.filter((m) => m != min);
      var y = maxprice.filter((x) => x != max);
      setMinprice(x);
      setMaxprice(y);
      getFilterProduct(category_id, brand_id, color_id, x, y);
    } else {
      var x = [...minprice, min];
      var y = [...maxprice, max];
      setMaxprice(y);
      setMinprice(x);
      getFilterProduct(category_id, brand_id, color_id, x, y);
    }
  }

  function category_filter(id) {
    if (category_id.includes(id)) {
      var x = category_id.filter((cate) => cate != id);
      setCategory_id(x);
      getFilterProduct(x, brand_id, color_id, minprice, maxprice);
    } else {
      var y = [...category_id, id];
      setCategory_id(y);
      getFilterProduct(y, brand_id, color_id, minprice, maxprice);
    }
  }

  function closetSort(e) {
    if (e.target.value == "date") {
      var sortbydate = products.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setProducts([...sortbydate]);
    }
    if (e.target.value == "alphabet") {
      var product = products.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        } else return 0;
      });

      setProducts([...product]);
    }
  }

  // paginate
  useEffect(() => {
    var startPage = (pageno - 1) * itemsPerPage;
    setStart(startPage);
    var endPage = pageno * itemsPerPage;
    setEnd(endPage);
  }, [pageno]);

  function paginate(value) {
    setPageno(value);
  }

  function cartButton(e, pid) {
    e.preventDefault();
    addtocartButton(pid, 1);
    props.history.push("/cartitems");
  }

  return (
    <main>
      <section className="products-listing py-5">
        <div className="container">
          <div className="row">
            <div className="col-sm-3 col-xs-3 col-md-2 col-lg-2">
              <div className="side-filter">
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h4 className="text-uppercase font-semibold mb-4">
                    Category
                  </h4>
                  <div className="child-categories-wrapper">
                    <CategoriesFilter
                      categories={categories}
                      category_filter={category_filter}
                      loading={initLoading}
                    />
                  </div>
                </div>
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h4 className="text-uppercase font-semibold mb-4">Brands</h4>
                  <div className="child-categories-wrapper">
                    <BrandsFilter
                      brands={brands}
                      brand_filter={brand_filter}
                      loading={initLoading}
                    />
                  </div>
                </div>
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h4 className="text-uppercase font-semibold mb-4">Color</h4>
                  <ColorsFilter
                    colors={colors}
                    color_filter={color_filter}
                    loading={initLoading}
                  />
                </div>
                <div className="siderbar-widget pb-4 mb-4">
                  <h4 className="text-uppercase font-semibold mb-4">Price</h4>
                  <PricesFilter
                    priceChange={priceChange}
                    prices={prices}
                    loading={initLoading}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-9 col-xs-9 col-md-10 col-lg-10">
              <section className="cate-banner">
                <div className="banner-img">
                  <img src="https://d2zlsagv0ouax1.cloudfront.net/assets/channel_covershots/img-covershot-women@2x.jpg" />
                </div>
                <div className="bnner-title">
                  <h3>Search Result</h3>
                </div>
              </section>
              {!products.length && !loading ? (
                <NoResult />
              ) : (
                <>
                  <div className="closet-sort align-items-center mb-4">
                    <div className="sort-by">Sort By :</div>

                    <select
                      className="ml-2 py-1 px-2 sortbotton"
                      onChange={(e) => closetSort(e)}
                    >
                      <option value="date">Date</option>
                      <option value="alphabet">Alphabet</option>
                    </select>
                  </div>
                  <div class="row">
                    {loading ? (
                      <ProductsCardSkeleton counts={12} />
                    ) : (
                      products.slice(start, end).map((product) => {
                        return (
                          <FilterPageProductCard
                            key={product._id}
                            product={product}
                          />
                        );
                      })
                    )}
                  </div>
                  <Pagination
                    activePage={pageno}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={products.length}
                    pageRangeDisplayed={5}
                    onChange={(e) => paginate(e)}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SearchResult;
