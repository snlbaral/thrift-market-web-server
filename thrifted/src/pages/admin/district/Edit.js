import React, { useEffect, useState } from "react";
import axios from "axios";

function Edit(props) {
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState(null);

  useEffect(() => {
    axios.get("/district/" + props.match.params.id).then((response) => {
      console.log(response.data);
      setDistricts(response.data);
      setDistrict(response.data.district);
    });
  }, []);

  function replace(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("district", district);

    axios
      .put("/district/" + props.match.params.id, data)
      .then((response) => {
        console.log(response.data);
        setDistricts(response.data);
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
              <div className="addheader">Edit District</div>

              <div className="card-body"></div>
              <form onSubmit={(e) => replace(e)}>
                <div className="form-group">
                  <input
                    type="district"
                    className="form-control detail"
                    name="name"
                    defaultValue={district}
                    onChange={(e) => setDistrict(e.target.value)}
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

export default Edit;
