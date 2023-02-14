import React, { useState } from "react";
import axios from "axios";
import $ from "jquery";

function Create(props) {
  const [district, setDistrict] = useState(null);

  function adddistrict(e) {
    e.preventDefault();
    const data = {
      district,
    };

    axios.post("/district", data).then((response) => {
      $(".district").val("");
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
              <div className="addheader">Add District</div>
              <form onSubmit={(e) => adddistrict(e)}>
                <div className="form-group">
                  <label htmlFor="formGroupExampleInput">District Name</label>
                  <input
                    type="text"
                    className="form-control district"
                    name="district"
                    onChange={(e) => setDistrict(e.target.value)}
                    id="formGroupExampleInput"
                    placeholder="Example input"
                    required
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

export default Create;
