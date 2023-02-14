import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { AddContext, useCartContext } from "../../../global/CartContext";
import CartHover from "../../../components/CartHover";
import ProductsCardSkeleton from "../../../components/ProductsCardSkeleton";
import CategoriesFilter from "../../../components/CategoriesFilter";
import BrandsFilter from "../../../components/BrandsFilter";
import ColorsFilter from "../../../components/ColorsFilter";
import PricesFilter from "../../../components/PricesFilter";
import FilterPageProductCard from "../../../components/FilterPageProductCard";
import { apiErrorNotification } from "./../../../global/Notification";
import NoResult from "../../../components/NoResult";

function CategoryPage(props) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [brand_id, setBrand_id] = useState([]);
  const [color_id, setColor_id] = useState([]);
  const [minprice, setMinprice] = useState([]);
  const [maxprice, setMaxprice] = useState([]);
  const [category_id, setCategory_id] = useState([]);
  const [currentcatId, setCurrentcatId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState([]);

  const [totalProduct, setTotalProduct] = useState(24);
  const [pageno, setPageno] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [sorting, setSorting] = useState("-_id");

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

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (
      brand_id.length ||
      color_id.length ||
      minprice.length ||
      category_id.length
    ) {
      getFilterProduct();
    } else {
      getProduct();
    }
  }, [props, pageno, sorting, brand_id, color_id, category_id, minprice]);

  async function getProduct() {
    setLoading(true);
    const data = {
      category_slug: props.match.params.slug,
      pageNo: pageno,
      sorting,
    };
    try {
      const response = await axios.post("/category/filter", data);
      setProducts(response.data.products);
      var temp_brands = [];
      response.data.brands.map((brand) => {
        if (temp_brands.some((temp) => temp.name == brand.name)) {
        } else {
          temp_brands.push(brand);
        }
      });
      setBrands(temp_brands);
      setCategories(response.data.categories);
      setCurrentcatId(response.data.category._id);
      setCurrentCategory(response.data.category);
      setColors(response.data.colors);
      setTotalProduct(response.data.count);
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
    var data = {
      brand_id,
      color_id,
      minprice,
      maxprice,
      category_id,
      pageNo: pageno,
      sorting,
    };
    if (category_id.length) {
    } else {
      data = {
        brand_id,
        color_id,
        minprice,
        maxprice,
        category_id: [currentcatId],
        pageNo: pageno,
        sorting,
      };
    }
    try {
      const response = await axios.post("/category/checkfilter", data);
      var x = response.data.products.filter(
        (v, i, a) => a.findIndex((t) => t._id === v._id) === i
      );
      setProducts(x);
      setTotalProduct(response.data.total);
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

  function brand_filter(id) {
    if (brand_id.includes(id)) {
      var x = brand_id.filter((br) => br != id);
      setBrand_id(x);
    } else {
      var b = [...brand_id, id];
      setBrand_id(b);
    }
  }

  function color_filter(id) {
    if (color_id.includes(id)) {
      var y = color_id.filter((c) => c != id);
      setColor_id(y);
    } else {
      var z = [...color_id, id];
      setColor_id(z);
    }
  }

  function priceChange(min, max) {
    if (minprice.includes(min) && maxprice.includes(max)) {
      var x = minprice.filter((m) => m != min);
      var y = maxprice.filter((x) => x != max);
      setMinprice(x);
      setMaxprice(y);
    } else {
      var x = [...minprice, min];
      var y = [...maxprice, max];
      setMaxprice(y);
      setMinprice(x);
    }
  }
  function category_filter(id) {
    if (category_id.includes(id)) {
      var x = category_id.filter((cate) => cate != id);
      setCategory_id(x);
      console.log(x);
    } else {
      var y = [...category_id, id];
      console.log(y);
      setCategory_id(y);
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

  function paginate(value) {
    setPageno(value);
    scrollTop();
  }

  return (
    <main>
      <section className="products-listing py-5">
        <div className="container-fluid">
          <div className="row px-3">
            <div className="col-sm-3 col-xs-3 col-md-3 col-lg-3 side-filter-wrapper">
              <div className="side-filter">
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h5 className="text-uppercase font-semibold mb-4">
                    Category
                  </h5>
                  <div className="child-categories-wrapper">
                    <CategoriesFilter
                      categories={categories}
                      category_filter={category_filter}
                      loading={initLoading}
                    />
                  </div>
                </div>
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h5 className="text-uppercase font-semibold mb-4">Brands</h5>
                  <div className="child-categories-wrapper">
                    <BrandsFilter
                      brands={brands}
                      brand_filter={brand_filter}
                      loading={initLoading}
                    />
                  </div>
                </div>
                <div className="siderbar-widget border-bottom pb-4 mb-4">
                  <h5 className="text-uppercase font-semibold mb-4">Color</h5>
                  <ColorsFilter
                    colors={colors}
                    color_filter={color_filter}
                    loading={initLoading}
                  />
                </div>
                <div className="siderbar-widget pb-4 mb-4">
                  <h5 className="text-uppercase font-semibold mb-4">Price</h5>
                  <PricesFilter
                    prices={prices}
                    priceChange={priceChange}
                    loading={initLoading}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-9 col-xs-9 col-md-9 col-lg-9">
              <section className="cate-banner">
                <div className="banner-img">
                  {currentCategory.cover ? (
                    <img src={currentCategory.cover} />
                  ) : (
                    <img src="/images/current-category.png" />
                  )}
                </div>
                <div className="bnner-title">
                  <h3 className="text-capitalize">
                    {props.match.params.slug} Category
                  </h3>
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
                  <div className="row">
                    {loading ? (
                      <ProductsCardSkeleton counts={12} />
                    ) : (
                      products.map((product) => {
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
                    totalItemsCount={totalProduct}
                    pageRangeDisplayed={5}
                    onChange={(e) => paginate(e)}
                    itemclassName="page-item"
                    linkclassName="page-link"
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

export default CategoryPage;
