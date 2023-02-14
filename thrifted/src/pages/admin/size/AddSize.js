import React, { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";

function AddSize(props) {
  const [name, setName] = useState("");

  function addsize(e) {
    e.preventDefault();
    const data = {
      name,
    };
    axios
      .post("/size", data)
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
      <div className=" container w-50 mx-auto">
        <form onSubmit={(e) => addsize(e)}>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput">Size Name</label>
            <input
              type="text"
              className="form-control size"
              name="name"
              onChange={(e) => setName(e.target.value)}
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
  );
}

export default AddSize;
