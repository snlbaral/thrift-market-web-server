import React, { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";

function AddColor(props) {
  const [name, setName] = useState(null);

  function addcolor(e) {
    e.preventDefault();
    const data = {
      name,
    };
    const config = {
      headers: {
        "access-token": localStorage.getItem("token"),
      },
    };

    axios.post("/color", data, config).then((response) => {
      $(".color").val("");
      console.log(response.data);
      props.history.goBack();
    });
  }

  return (
    <div className="content-wrapper">
      <div className="container w-50 mx-auto">
        <form onSubmit={(e) => addcolor(e)}>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput">color Name</label>
            <input
              type="text"
              className="form-control color"
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

export default AddColor;
