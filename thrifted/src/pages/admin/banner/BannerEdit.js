import React, { useEffect, useState } from "react";
import axios from "axios";

function BannerEdit(props) {
  const [banner, setBanner] = useState([]);
  const [title, setTitle] = useState(null);
  const [link, setLink] = useState(null);
  const [image, setImage] = useState(null);
  const [section, setSection] = useState(null);

  useEffect(() => {
    axios.get("/banner/" + props.match.params.id).then((response) => {
      console.log(response.data);
      setBanner(response.data);
      setTitle(response.data.title);
      setLink(response.data.link);
      setImage(response.data.image);
      setSection(response.data.section);
    });
  }, []);

  function replace(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("title", title);
    data.append("link", link);
    data.append("image", image);
    data.append("section", section);
    axios.put("/banner/" + props.match.params.id, data).then((response) => {
      props.history.push("/admin/banner");
      console.log(response.data);
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
              <div className="addheader">Edit Banner</div>

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
                      type="name"
                      className="form-control detail"
                      name="title"
                      defaultValue={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="name"
                      className="form-control detail"
                      name="link"
                      defaultValue={link}
                      onChange={(e) => setLink(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={(e) => setSection(e.target.value)}
                    >
                      <option defaultValue={section} selected>
                        {section}
                      </option>
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="last">Last</option>
                    </select>
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

export default BannerEdit;
