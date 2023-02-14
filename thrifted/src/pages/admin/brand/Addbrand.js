import React, { useState } from "react";
import axios from "axios";

function Addbrand(props) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function brand(e) {
    const config = {
      headers: {
        "access-token": localStorage.getItem("token"),
      },
    };
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("image", image);

    axios
      .post("/brand", data, config)
      .then((response) => {
        console.log(response.data);
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
              <div className="addheader">Add Brand</div>
              <form onSubmit={(e) => brand(e)}>
                <div className="form-group">
                  <label for="exampleInputEmail1">Name</label>
                  <input
                    type="name"
                    name="name"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Name"
                  />
                </div>
                <div class="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    name="image"
                    class="form-control-file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
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
  );
}

export default Addbrand;
