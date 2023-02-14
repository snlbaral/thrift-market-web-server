import React, { useState, useEffect } from "react";
import axios from "axios";

function AddCategory(props) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [parent_id, setParent_id] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cover, setCover] = useState("");

  function addcategory(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("image", image);
    data.append("cover", cover);
    if (parent_id) {
      data.append("parent_id", parent_id);
    }

    axios
      .post("/category", data)
      .then((response) => {
        console.log(response.data);
        props.history.goBack();
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }

  useEffect(() => {
    axios
      .get("/category")
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }, []);

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
              <div className="addheader">Add Category</div>
              <div className="card-body">
                <form onSubmit={(e) => addcategory(e)}>
                  <div className="form-group">
                    <label for="exampleInputEmail1">Name</label>
                    <input
                      type="name"
                      name="name"
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Category Name"
                    />
                  </div>
                  <div class="form-group">
                    <label>Category Image</label>
                    <input
                      type="file"
                      name="image"
                      class="form-control-file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                  <div class="form-group">
                    <label>Category Cover Image</label>
                    <input
                      type="file"
                      name="image"
                      class="form-control-file"
                      onChange={(e) => setCover(e.target.files[0])}
                    />
                  </div>

                  <div className="form-group">
                    <label>Select Parent Category</label>
                    <select
                      className="form-control"
                      onChange={(e) => setParent_id(e.target.value)}
                    >
                      <option value="">None</option>
                      {categories.map((category) => {
                        return (
                          <>
                            <option value={category._id} key={category._id}>
                              {category.name}
                            </option>
                            <Nested cat={category.childrens} n={1} />
                          </>
                        );
                      })}
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Nested({ cat, n }) {
  var inc = n;
  function increment(n) {
    var ele = "\u00A0 \u00A0 \u00A0";
    inc += 1;
    return ele.repeat(n);
  }

  return (
    <>
      {cat.map((catee) => {
        return (
          <>
            <option value={catee._id}>
              {increment(n)} {catee.name}
            </option>
            <Nested cat={catee.childrens} n={inc} />
          </>
        );
      })}
    </>
  );
}

export default AddCategory;
