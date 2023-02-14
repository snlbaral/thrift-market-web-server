import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import { useCartContext } from "../../../global/CartContext";
import Select from "react-select";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";
import CreatePostImagePicker from "../../../components/CreatePostImagePicker";

function EditPost(props) {
  const [product, setProduct] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState("");
  const [imagesrc, setImagesrc] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState([]);
  const [category, setCategory] = useState([]);
  const [cate, setCate] = useState(null);
  const [brandd, setBrandd] = useState(null);
  const [colord, setColord] = useState(null);
  const [featureimg, setFeatureimg] = useState([]);
  const [originalprice, setOriginalPrice] = useState(0);
  const [customBrand, setCustomBrand] = useState(false);
  const [size, setSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [earningPrice, setEarningPrice] = useState(0);
  const [featureCount, setFeatureCount] = useState([{}, {}, {}, {}]);
  const [pickupOption, setPickupOption] = useState(null);

  const { currentUser, config, setPageLoader } = useCartContext();
  const [loading, setLoading] = useState(true);
  const pickupOptions = [
    {
      label: "Pickup from Home(extra Rs.15)",
      value: "door",
    },
    {
      label: "Self Deliver to Branch",
      value: "branch",
    },
  ];

  const productTypes = [
    {
      label: "Rent",
      value: "rent",
    },
    {
      label: "Sale",
      value: "sale",
    },
  ];

  function getPickupOptions(pickup) {
    return pickupOptions.find((pk) => pk.value == pickup);
  }

  function getProductType(type) {
    return productTypes.find((pt) => pt.value == type);
  }

  async function getProduct() {
    try {
      const response = await axios.get(
        "/product/" + props.match.params.id,
        config
      );
      setProduct(response.data);
      setName(response.data.name);
      setStock(response.data.stock);
      setPrice(response.data.price);
      setType(response.data.type);
      setDetail(response.data.detail);
      setImagesrc(response.data.image);
      setCategory(response.data.category_id);
      setSize(response.data.size_id._id);
      setBrand(response.data.brand_id);
      setCate(response.data.category_id._id);
      setBrandd(response.data.brand_id._id);
      setColor(response.data.color_id);
      setColord(response.data.color_id._id);
      setPickupOption(response.data.pickupOption);
      setLoading(false);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  async function getVariousData(api, handleResult) {
    try {
      const response = await axios.get(api);
      handleResult(response.data);
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  useEffect(() => {
    getProduct();
    getVariousData("/category", setCategories);
    getVariousData("/brand", setBrands);
    getVariousData("/color", setColors);
    getVariousData("/size", setSizes);
  }, [props]);

  useEffect(() => {
    var p = price;
    p = p - (p * 20) / 100;
    setEarningPrice(p);
  }, [price]);

  async function replace(e) {
    setPageLoader(true);
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("stock", stock);
    data.append("price", price);
    data.append("detail", detail);
    if (image) {
      console.log(image);
      data.append("image", image);
    }
    data.append("brand", brandd);
    data.append("category", cate);
    data.append("type", type);
    data.append("color", colord);
    data.append("original", originalprice);
    data.append("size", size);
    data.append("earning", earningPrice);
    data.append("pickupOption", pickupOption);
    for (var i = 0; i < featureimg.length; i++) {
      data.append("feature", featureimg[i]);
    }
    try {
      await axios.put("/product/" + props.match.params.id, data, config);
      customSuccessNotification("Post Updated");
      props.history.push("/closet/" + currentUser._id);
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
    return (
      ele.repeat(parent.length ? parent.length - 1 : 0) +
      parent.join(" \u203A ")
    );
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

  return loading ? (
    <div className="skeleton edit-post-container"></div>
  ) : (
    <div className="container py-5 mb-5 post_create">
      <section className="mainsection">
        <h3>Edit List</h3>
        <hr />
      </section>
      <form onSubmit={(e) => replace(e)}>
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
              <div className="form-group old-edit-post-img">
                <div className="row">
                  <div className="col-md-4 post-main-img">
                    <div className="main-image-wrapper">
                      <img
                        src={imagesrc}
                        name="image"
                        className="firstimg img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-md-8 post-feature-img">
                    <div className="row">
                      {product.feature_image &&
                        product.feature_image.length &&
                        featureCount.map((feature, index) => {
                          return (
                            <div className="col-md-3">
                              <div className="card">
                                <div className="card-body featurewrapper d-flex justify-content-center align-items-center">
                                  <img
                                    src={product.feature_image[index]}
                                    className="featureimg img-fluid"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <CreatePostImagePicker
                setImage={setImage}
                setFeatureimg={setFeatureimg}
                title="Replace Photos"
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
                  defaultValue={name}
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
                Tell shoppers about your listing by describing the Brand, Size,
                Color, Condition, Material, and any other noteworthy details.
              </span>
            </div>
            <div className="col-md-9 pb-5">
              <div className="form-group">
                <textarea
                  className="checknote w-100 p-3"
                  rows="5"
                  name="detail"
                  defaultValue={detail}
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
                  onMenuClose={() => removeSpaceOfSelectedOption()}
                  defaultValue={{
                    label: category.name,
                    value: category._id,
                  }}
                  name="category"
                />
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
                  defaultValue={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Quanity of the product for sale"
                  required
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
                  defaultValue={{
                    label: product.size_id?.name,
                    value: product.size_id?._id,
                  }}
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
                Add details to help your buyers find your item quickly.
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
                  defaultValue={{
                    label: brand.name,
                    value: brand._id,
                  }}
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
                name="color"
                options={makeReactSelectOptions(colors)}
                placeholder="Select Color"
                onChange={({ value }) => setColor(value)}
                required={true}
                defaultValue={{ label: color.name, value: color._id }}
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
                  defaultValue={product.original}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Listing Price</label>
                <input
                  className="form-control"
                  name="price"
                  defaultValue={product.price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Your Earning (when sold) </label>
                <input
                  className="form-control"
                  name="earning_price"
                  value={earningPrice}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Pickup Option</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="pickup"
                  options={pickupOptions}
                  placeholder="Select Pickup Option"
                  onChange={({ value }) => setPickupOption(value)}
                  defaultValue={{
                    label: getPickupOptions(pickupOption)?.label,
                    value: getPickupOptions(pickupOption)?.value,
                  }}
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
                  options={productTypes}
                  placeholder="Select Product Type"
                  onChange={({ value }) => setType(value)}
                  defaultValue={{
                    label: getProductType(product.type).label,
                    value: getProductType(product.type).label,
                  }}
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
  );
}

export default EditPost;
