import React, { useEffect, useState } from "react";
import axios from "axios";

function Editbrand(props) {
  const [brand, setBrand] = useState([]);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    axios.get("/brand/" + props.match.params.id).then((response) => {
      console.log(response.data);
      setBrand(response.data);
      setName(response.data.name);
      setImage(response.data.image);
    });
  }, []);

  function replace(e, id) {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("image", image);

    axios
      .put("/brand/" + props.match.params.id, data)
      .then((response) => {
        console.log(response.data);
        setBrand(response.data);
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
              <div className="addheader">Edit Brand</div>

              <div className="card-body"></div>
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
  );
}

export default Editbrand;
