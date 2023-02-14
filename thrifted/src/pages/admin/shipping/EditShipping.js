import React, { useState, useEffect } from "react";
import axios from "axios";

function EditShipping(props) {
  const [shippings, setShippings] = useState([]);
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState("");
  const [days, setDays] = useState("");

  useEffect(() => {
    axios.get("/shippings/" + props.match.params.id).then((response) => {
      console.log(response.data);
      setLocation(response.data.location);
      setFee(response.data.fee);
      setDays(response.data.days);
    });
  }, []);

  const data = {
    location,
    fee,
    days,
  };
  axios.put("/shipping/" + props.match.params.id, data).then((response) => {
    console.log(response.data);
  });

  return (
    <div>
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
                <div className="addheader">Edit Product</div>
                <div className="card-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="formGroupExampleInput">
                        Shipping Location
                      </label>
                      <input
                        type="text"
                        className="form-control color"
                        defaultValue={location}
                        name="location"
                        onChange={(e) => setLocation(e.target.value)}
                        id="formGroupExampleInput"
                        placeholder="Example location"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="formGroupExampleInput">
                        Shipment Days
                      </label>
                      <input
                        type="text"
                        className="form-control color"
                        name="days"
                        defaultValue={days}
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
                        defaultValue={fee}
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
    </div>
  );
}

export default EditShipping;
