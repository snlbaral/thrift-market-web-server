import React, { useState } from "react";
import axios from "axios";

function BannerAdd(props) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [section, setSection] = useState(null);

  function banner(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("title", title);
    data.append("link", link);
    data.append("image", image);
    data.append("section", section);
    console.log(section);
    axios
      .post("/banner", data)
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
        <div className="row justify-content-center ">
          <div className="col-md-9">
            <button
              className="btn btn-success float-right mb-4"
              onClick={() => props.history.goBack()}
            >
              Go Back
            </button>

            <div className="card clear">
              <div className="addheader">Add Banner</div>

              <div className="card-body">
                <form onSubmit={(e) => banner(e)}>
                  <div className="form-group">
                    <label for="exampleInputEmail1">Title</label>
                    <input
                      type="name"
                      name="title"
                      className="form-control"
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter Name"
                    />
                  </div>
                  <div className="form-group">
                    <label for="exampleInputEmail1">Link</label>
                    <input
                      type="name"
                      name="link"
                      className="form-control"
                      onChange={(e) => setLink(e.target.value)}
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

                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={(e) => setSection(e.target.value)}
                    >
                      <option value="">Select banner position</option>
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="last">Last</option>
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

export default BannerAdd;
