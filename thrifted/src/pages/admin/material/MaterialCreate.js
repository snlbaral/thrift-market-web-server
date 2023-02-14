import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiErrorNotification } from "./../../../global/Notification";

function MaterialCreate(props) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [featureimg, setFeatureimg] = useState([]);
  const config = {
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  };

  async function add(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("stock", stock);
    data.append("price", price);
    data.append("original", price);
    data.append("earning", price);
    data.append("sku", sku);
    data.append("detail", detail);
    data.append("image", image);
    data.append("brand", "NONE");
    data.append("category", "Unknown");
    data.append("color", "Unknown");
    data.append("type", "material");
    for (var i = 0; i < featureimg.length; i++) {
      data.append("feature", featureimg[i]);
    }
    try {
      await axios.post("/material", data, config);
      props.history.goBack();
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="container py-5 mx-auto">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <button
              className="btn btn-success float-right mb-4"
              onClick={() => props.history.goBack()}
            >
              Go Back
            </button>

            <div className="card clear">
              <div className="addheader">Add Product</div>
              <div className="card-body">
                <form onSubmit={(e) => add(e)}>
                  <div className="form-group">
                    <label>Material Image</label>
                    <br />
                    <input
                      type="file"
                      name="image"
                      className="detail"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Material Feature Images</label>
                    <br />
                    <input
                      type="file"
                      name="feature"
                      className="detail"
                      onChange={(e) => setFeatureimg(e.target.files)}
                      multiple
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="name"
                      className="form-control detail"
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="product name here"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="h-100 col-md-12 py-3"
                      name="detail"
                      onChange={(e) => setDetail(e.target.value)}
                      placeholder="detail here"
                      required
                      rows="5"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <input
                      type=""
                      className="form-control detail"
                      name="price"
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="product price"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type=""
                      className="form-control detail"
                      name="stock"
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="product stock"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="name"
                      className="form-control detail"
                      name="sku"
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="product sku"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type=""
                      className="form-control detail"
                      name="size"
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="Material Size"
                      required
                    />
                  </div>
                  <button className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialCreate;
