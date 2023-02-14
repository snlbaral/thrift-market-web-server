import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useCartContext } from "../../../global/CartContext";
import CartHover from "../../../components/CartHover";
import ProductsCardSkeleton from "../../../components/ProductsCardSkeleton";
import BrandsFilter from "../../../components/BrandsFilter";
import ColorsFilter from "../../../components/ColorsFilter";
import PricesFilter from "../../../components/PricesFilter";
import FilterPageProductCard from "../../../components/FilterPageProductCard";
import { apiErrorNotification } from "./../../../global/Notification";
import NoResult from "../../../components/NoResult";

function BrandPage(props) {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brand_id, setBrand_id] = useState([]);
  const [color_id, setColor_id] = useState([]);
  const [minprice, setMinprice] = useState([]);
  const [maxprice, setMaxprice] = useState([]);
  const [currentBrand, setCurrentBrand] = useState([]);

  const [pageno, setPageno] = useState(1);
  const [sorting, setSorting] = useState("-_id");
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(12);
  const [total, setTotal] = useState(24);

  const [loading, setLoading] = useState(true);
  const [initLoading, setInitLoading] = useState(true);

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
    if (brand_id.length || color_id.length || minprice.length) {
      getFilterProduct();
    } else {
      getProduct();
    }
  }, [props, pageno, sorting, brand_id, color_id, minprice]);

  async function getProduct() {
    setLoading(true);
    const data = {
      slug: props.match.params.slug,
      pageno,
      sorting,
    };
    try {
      const response = await axios.post("/brand/filter", data);
      setProducts(response.data.products);
      setColors(response.data.colors);
      setCurrentBrand(response.data.brand);
      var newbrand = response.data.brands.filter(
        (brand) => brand.slug != data.slug
      );
      setBrands(newbrand);
      var bid = response.data.brands.find((br) => br.slug == data.slug);
      var a = [...brand_id, bid._id];
      setBrand_id(a);
      setTotal(response.data.total);
      setLoading(false);
      if (initLoading) {
        setInitLoading(false);
      }
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  async function getFilterProduct() {
    setLoading(true);
    const data = {
      color_id,
      minprice,
      maxprice,
      brand_id,
      pageno,
      sorting,
    };
    try {
      const response = await axios.post("/brand/brandcheck", data);
      setProducts(response.data.products);
      setTotal(response.data.total);
      var currentPageNo = response.data.total / itemsPerPage;
      currentPageNo = Math.ceil(currentPageNo);
      if (currentPageNo < pageno) {
        setPageno(currentPageNo);
      }
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  function color_filter(id) {
    if (color_id.includes(id)) {
      var x = color_id.filter((cid) => cid != id);
      setColor_id(x);
    } else {
      var y = [...color_id, id];
      setColor_id(y);
    }
  }

  function priceChange(min, max) {
    if (minprice.includes(min) && maxprice.includes(max)) {
      var x = minprice.filter((m) => m != min);
      var y = maxprice.filter((mx) => mx != max);
      setMinprice(x);
      setMaxprice(y);
    } else {
      var a = [...minprice, min];
      var b = [...maxprice, max];
      setMinprice(a);
      setMaxprice(b);
    }
  }

  function brand_filter(id) {
    if (brand_id.includes(id)) {
      var a = brand_id.filter((b) => b != id);
      setBrand_id(a);
    } else {
      var y = [...brand_id, id];
      setBrand_id(y);
    }
  }

  function closetSort(e) {
    if (e.target.value == "date") {
      setSorting("-_id");
    }
    if (e.target.value == "alphabet") {
      setSorting("name");
    }
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function paginate(value) {
    setPageno(value);
    scrollTop();
  }

  return (
    <main>
      <section className="products-listing py-100">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xs-3 col-md-3 col-lg-3 side-filter-wrapper">
              <div className="side-filter">
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h4 className="text-uppercase font-semibold mb-4">Brands</h4>
                  <div className="child-categories-wrapper">
                    <BrandsFilter
                      brand_filter={brand_filter}
                      brands={brands}
                      loading={initLoading}
                    />
                  </div>
                </div>
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h4 className="text-uppercase font-semibold mb-4">Color</h4>
                  <ColorsFilter
                    color_filter={color_filter}
                    colors={colors}
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

            <div className="col-sm-9 col-xs-9 col-md-9 col-lg-9">
              <section className="cate-banner">
                <div className="banner-img">
                  {currentBrand.image ? (
                    <img src={currentBrand.image} />
                  ) : (
                    <img src="/images/default-brand.png" />
                  )}
                </div>
                <div className="bnner-title">
                  <h3>{currentBrand.name}</h3>
                </div>
              </section>
              {!products.length && !loading ? (
                <NoResult />
              ) : (
                <>
                  <div className="section-title uppercase">
                    <h2 className="mt-0 mb-20 ">NEW ARRIVALS</h2>
                  </div>
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
                    totalItemsCount={total}
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

export default BrandPage;
