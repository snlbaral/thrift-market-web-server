import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import $ from "jquery";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { AddContext, useCartContext } from "../../../global/CartContext";
import Select from "react-select";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";
import "bootstrap/dist/js/bootstrap.min.js";
import CreatePostImagePicker from "../../../components/CreatePostImagePicker";

function CreatePost(props) {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { config, setPageLoader, isSeller } = useCartContext();

  useEffect(() => {
    if (!isSeller) {
      return props.history.push("/add-pickup-location");
    }
  }, [props]);

  // form
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [featureimg, setFeatureimg] = useState([]);
  const [type, setType] = useState("");
  const [originalprice, setOriginalPrice] = useState(0);
  const [customBrand, setCustomBrand] = useState(false);
  const [earningPrice, setEarningPrice] = useState(0);
  const [pickup, setPickup] = useState("");
  const categorySelectRef = useRef();

  useEffect(() => {
    getData();
  }, [props]);

  async function getData() {
    try {
      const response = await axios.get("/frontend/createpost", config);
      setColors(response.data.colors);
      setSizes(response.data.sizes);
      setCategories(response.data.categories);
      setBrands([...response.data.brands, { _id: "others", name: "Others" }]);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  useEffect(() => {
    var p = price;
    p = p - (p * 20) / 100;
    if (pickup == "door") {
      p = p - 15;
    }
    setEarningPrice(p);
  }, [price]);

  useEffect(() => {
    if (pickup == "door") {
      setEarningPrice(earningPrice - 15);
    } else {
      var p = price;
      p = p - (p * 20) / 100;
      setEarningPrice(p);
    }
  }, [pickup]);

  async function add(e) {
    setPageLoader(true);

    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("stock", stock);
    data.append("price", price);
    data.append("detail", detail);
    data.append("image", image);
    data.append("brand", brand);
    data.append("category", category);
    data.append("color", color);
    data.append("size", size);
    data.append("type", type);
    data.append("original", originalprice);
    data.append("custombrand", customBrand);
    data.append("earning", earningPrice);
    data.append("pickupOption", pickup);
    for (var i = 0; i < featureimg.length; i++) {
      data.append("feature", featureimg[i]);
    }
    try {
      await axios.post("/product", data, config);
      $("#createpost")[0].reset();
      customSuccessNotification("Post has been created.");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  function postBrand(value) {
    if (value == "others") {
      setCustomBrand(true);
      $(".otherbrand").show();
    } else {
      setBrand(value);
      $(".otherbrand").hide();
      setCustomBrand(false);
    }
  }

  function makeReactSelectOptions(options) {
    const arr = [];
    options.map((opt) => {
      arr.push({
        label: opt.name,
        value: opt._id,
      });
    });
    return arr;
  }

  function findParents(category) {
    var ele = "\u00A0 \u00A0 \u00A0";
    var parent = [];
    var isParent = categories.find((cate) => cate._id == category._id);
    if (isParent) return category.name;
    exit_loops: for (const parent_cat of categories) {
      var find = parent_cat.childrens.find((cate) => cate._id == category._id);
      if (find) {
        parent.push(parent_cat.name, find.name);
        break exit_loops;
      }
      if (parent_cat.childrens) {
        for (const children of parent_cat.childrens) {
          var find2 = children.childrens.find((c) => c._id == category._id);
          if (find2) {
            parent.push(parent_cat.name, children.name, find2.name);
            break exit_loops;
          }
        }
      }
    }
    return ele.repeat(parent.length - 1) + parent.join(" \u203A ");
  }

  function parseNestedCategories(categories, arr) {
    categories.map((category) => {
      arr.push({
        label: `${findParents(category)}`,
        value: category._id,
      });
      if (category.childrens.length) {
        parseNestedCategories(category.childrens, arr);
      }
    });
    return arr;
  }

  function makeCategoryOptions(categories) {
    return parseNestedCategories(categories, []);
  }

  useEffect(() => {
    removeSpaceOfSelectedOption();
  }, [category]);

  function removeSpaceOfSelectedOption() {
    var text = $(".basic-single-category .select__single-value").text();
    if (text) {
      var newtext = text.replace("&nbsp;", "");
      $(".basic-single-category .select__single-value").html(newtext.trim());
    }
  }

  return (
    <section className="pt-7 pb-12  py-5">
      <div className="col-12 text-center inner-header">
        <h3>Create Post</h3>
      </div>
      <div className="container py-5 mb-5 post_create">
        <form onSubmit={(e) => add(e)} id="createpost" autoComplete="off">
          <section className="post_photo">
            <div className="row ">
              <div className="col-md-3 pb-5">
                <h5>PHOTOS & VIDEO</h5>
                <span className="post-span">
                  Add up to 16 photos and 1 video to show the angles and details
                  of your item.
                </span>
              </div>
              <div className="col-md-9 pb-5">
                <CreatePostImagePicker
                  setImage={setImage}
                  setFeatureimg={setFeatureimg}
                />
              </div>
            </div>
            <hr />
          </section>
          <section className="post_detail pb-5">
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5> TITLE</h5>
                <span className="post-span">
                  Share key details like Brand, Size, and Color.
                </span>
              </div>
              <div className="col-md-9">
                <div className="form-group">
                  <input
                    className="form-control"
                    name="name"
                    placeholder="What Are You Selling?(required)"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row ">
              <div className="col-md-3 pb-5">
                <h5> DESCRIPTION</h5>
                <span className="post-span">
                  Tell shoppers about your listing by describing the Brand,
                  Size, Color, Condition, Material, and any other noteworthy
                  details.
                </span>
              </div>
              <div className="col-md-9 pb-5">
                <div className="form-group">
                  <textarea
                    className="checknote w-100 p-3"
                    rows="5"
                    name="detail"
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="Describe it(required)"
                    required
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="post_category pb-5">
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5>CATEGORY *</h5>
                <span className="post-span">
                  Add details to help your buyers find your item quickly.
                </span>
              </div>
              <div className="col-md-9 pb-5">
                <div className="form-group mr-3 w-100">
                  <Select
                    className="basic-single-category"
                    classNamePrefix="select"
                    options={makeCategoryOptions(categories)}
                    placeholder="Select Category"
                    onChange={({ value }) => setCategory(value)}
                    required={true}
                    name="category"
                    onMenuClose={() => removeSpaceOfSelectedOption()}
                  />

                  {/* <select
                    className="form-control w-100"
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => {
                      return (
                        <>
                          <option value="{category._id}" key={category._id}>
                            {category.name}
                          </option>
                          <Nested cat={category.childrens} n={1} />
                        </>
                      );
                    })}
                  </select> */}
                </div>
              </div>
            </div>
          </section>
          <section className="post_size">
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5> QUANTITY</h5>
              </div>
              <div className="col-md-9 pb-5">
                <div className="form group">
                  <input
                    type="text"
                    className="form-control"
                    name="stock"
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Quanity of the product for sale"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5>SIZE</h5>
              </div>
              <div className="col-md-9 pb-5">
                <div className="form-group">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    options={makeReactSelectOptions(sizes)}
                    placeholder="Select Size"
                    onChange={({ value }) => setSize(value)}
                    required={true}
                    name="size"
                  />
                </div>
              </div>
            </div>
            <hr />
          </section>
          <section className="post_brand">
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5>BRAND</h5>
                <span className="post-span">
                  Select Others if you can not find brand you are looking for.
                </span>
              </div>
              <div className="col-md-9 pb-5">
                <div className="form-group">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="brands"
                    options={makeReactSelectOptions(brands)}
                    placeholder="Select Brand"
                    onChange={({ value }) => postBrand(value)}
                    required={true}
                  />

                  <input
                    type="text"
                    name="customBrand"
                    className="form-control  otherbrand mt-4"
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Enter Your Brand"
                  />
                </div>
              </div>
            </div>
            <hr />
          </section>
          <section className="post_color">
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5>COLOR</h5>
                <span className="post-span">OPTIONAL</span>
              </div>
              <div className="col-md-9 pb-5">
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="colors"
                  options={makeReactSelectOptions(colors)}
                  placeholder="Select Color"
                  onChange={({ value }) => setColor(value)}
                  required={true}
                />
              </div>
            </div>
            <hr />
          </section>
          <section className="post-pricing">
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5>PRICING *</h5>
                <span className="post-span">
                  {" "}
                  View Poshmark’s seller fee policy
                </span>
              </div>
              <div className="col-md-9 pb-5">
                <div className="form-group">
                  <label>Original Price</label>
                  <input
                    className="form-control"
                    name="original"
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Listing Price</label>
                  <input
                    className="form-control"
                    name="price"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Your Earning (when sold) </label>
                  <input
                    className="form-control"
                    value={earningPrice}
                    name="earning_price"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Pickup Option</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="pickup"
                    options={[
                      {
                        label: "Pickup from Home(extra Rs.15)",
                        value: "door",
                      },
                      {
                        label: "Self Deliver to Branch",
                        value: "branch",
                      },
                    ]}
                    placeholder="Select Pickup Option"
                    onChange={({ value }) => setPickup(value)}
                    required={true}
                  />
                </div>
              </div>
            </div>
            <hr />
          </section>
          <section className="post_availability">
            <div className="row">
              <div className="col-md-3 pb-5">
                <h5>AVAILABILITY *</h5>
                <span className="post-span">Question? Learn more..</span>
              </div>
              <div className="col-md-9 pb-5">
                <div className="form-group">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="type"
                    options={[
                      {
                        label: "Rent",
                        value: "rent",
                      },
                      {
                        label: "Sale",
                        value: "sale",
                      },
                    ]}
                    placeholder="Select Product Type"
                    onChange={({ value }) => setType(value)}
                    required={true}
                  />
                </div>
              </div>
            </div>
            <hr />
          </section>
          <section className="post-botton d-flex float-right space-between-zero"></section>
          <button className="btn create-post-submit">Submit</button>
        </form>
      </div>
    </section>
  );
}
// function Nested({ cat, n }) {
//   var inc = n;
//   function increment(n) {
//     var ele = "\u00A0 \u00A0 \u00A0";
//     inc += 1;
//     return ele.repeat(n);
//   }

//   return (
//     <>
//       {cat.map((catee) => {
//         return (
//           <>
//             <option value={catee._id}>
//               {increment(n)} {catee.name}
//             </option>
//             <Nested cat={catee.childrens} n={inc} />
//           </>
//         );
//       })}
//     </>
//   );
// }

export default CreatePost;
