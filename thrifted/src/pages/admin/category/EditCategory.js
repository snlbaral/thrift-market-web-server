import React, { useEffect, useState } from "react";
import axios from "axios";

function EditCategory(props) {
  const [category, setCategory] = useState([]);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [cover, setCover] = useState("");
  const [parent_id, setParent_id] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        "access-token": localStorage.getItem("token"),
      },
    };
    axios.get("/category/" + props.match.params.id, config).then((response) => {
      console.log(response.data);

      setName(response.data.name);
      setImage(response.data.image);
      setParent_id(response.data.parent_id);
      setCover(response.data.cover);
    });

    axios
      .get("/category", config)
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }, []);

  function replace(e, id) {
    const config = {
      headers: {
        "access-token": localStorage.getItem("token"),
      },
    };

    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("image", image);
    data.append("cover", cover);
    data.append("parent_id", parent_id);

    axios
      .put("/category/" + props.match.params.id, data, config)
      .then((response) => {
        console.log(response.data);
        setCategory(response.data);
        props.history.goBack();
      })
      .catch((err) => {
        console.log(err.request.response);
      });
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
              <div className="addheader">Edit Category</div>

              <div className="card-body">
                <form onSubmit={(e) => replace(e)}>
                  <div className="form-group">
                    <input
                      type="file"
                      name="image"
                      defaultValue={image}
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="file"
                      name="image"
                      defaultValue={cover}
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
                            {category._id == parent_id ? (
                              <option
                                value={category._id}
                                key={category._id}
                                selected
                              >
                                {category.name}
                              </option>
                            ) : (
                              <option value={category._id} key={category._id}>
                                {category.name}
                              </option>
                            )}

                            <Nested
                              cat={category.childrens}
                              parent_id={parent_id}
                              n={1}
                            />
                          </>
                        );
                      })}
                    </select>
                  </div>

                  <div className="form-group">
                    <input
                      type="name"
                      className="form-control detail"
                      name="name"
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
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

function Nested({ cat, n, parent_id }) {
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
            {catee._id == parent_id ? (
              <option value={catee._id} selected>
                {increment(n)} {catee.name}
              </option>
            ) : (
              <option value={catee._id}>
                {increment(n)} {catee.name}
              </option>
            )}

            <Nested cat={catee.childrens} parent_id={parent_id} n={inc} />
          </>
        );
      })}
    </>
  );
}

export default EditCategory;
