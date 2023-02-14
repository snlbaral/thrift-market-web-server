import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

function City() {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    axios
      .get("/city")
      .then((response) => {
        console.log(response.data);
        setCities(response.data);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }, []);

  function distroy(id) {}

  return (
    <div className="content-wrapper">
      <Link className="btn btn-secondary float-right" to="/admin/createcity">
        Add City
      </Link>
      <div className="table-responsive mt-5 clearfix ">
        <table
          className="table table-light bg-white table-striped border-0"
          id="myTable"
          cellPadding="5"
        >
          <thead>
            <tr className="trhead">
              <th scope="col">#</th>
              <th scope="col">Cities</th>
              <th scope="col">District</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {cities.map((city) => {
              return (
                <tr key={city._id}>
                  <th scope="row">{city._id}</th>
                  <td> {city.city}</td>
                  <td> {city.district_id.district}</td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      to={`/admin/editcity/${city._id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => distroy(city._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default City;
