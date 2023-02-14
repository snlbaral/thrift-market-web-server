import React, { useState } from "react";
import axios from "axios";

function AddShipping(props) {
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState("");
  const [days, setDays] = useState("");

  function addship(e) {
    e.preventDefault();
    const data = {
      location,
      fee,
      days,
    };
    axios
      .post("/shipping", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }

  return (
    <div className="content-wrapper">
      <div className="container  mx-auto">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <button
              className="btn btn-success float-right mb-4"
              onClick={() => props.history.goBack()}
            >
              Go Back
            </button>

            <div className="card clear">
              <div className="addheader">Add Shipping</div>

              <div className="card-body">
                <form onSubmit={(e) => addship(e)}>
                  <div className="form-group">
                    <label htmlFor="formGroupExampleInput">
                      Shipping Location
                    </label>
                    <input
                      type="text"
                      className="form-control color"
                      name="location"
                      onChange={(e) => setLocation(e.target.value)}
                      id="formGroupExampleInput"
                      placeholder="Example location"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="formGroupExampleInput">Shipment Days</label>
                    <input
                      type="text"
                      className="form-control color"
                      name="days"
                      onChange={(e) => setDays(e.target.value)}
                      id="formGroupExampleInput"
                      placeholder="Example shipment days"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="formGroupExampleInput">
                      shipping Charge
                    </label>
                    <input
                      type="text"
                      className="form-control color"
                      name="fee"
                      onChange={(e) => setFee(e.target.value)}
                      id="formGroupExampleInput"
                      placeholder="Example shipping fee"
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
    </div>
  );
}

export default AddShipping;
