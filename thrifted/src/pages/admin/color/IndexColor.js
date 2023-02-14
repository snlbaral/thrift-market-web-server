import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

function IndexColor() {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    axios.get("/color").then((response) => {
      console.log(response.data);
      setColors(response.data);
      $("#myTable").DataTable();
    });
  }, []);

  function distroy(e, id) {
    axios.delete("/color/" + id).then((response) => {
      console.log(response.data);

      // setColors(response.data)

      const products = [...colors];
      console.log(products);
      const index = products.findIndex((product) => product._id === id);
      console.log(index);
      products.splice(index, 1);
      setColors(products);
    });
  }

  return (
    <div className="content-wrapper">
      <div className="container ">
        <Link
          className="btn btn-secondary float-right mb-2"
          to="/admin/addcolor"
        >
          {" "}
          Add
        </Link>

        <div className="table-responsive mt-5">
          <table
            className="table table-light bg-white table-striped"
            id="myTable"
          >
            <thead>
              <tr className="trhead">
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {colors.map((color) => {
                return (
                  <tr key={color._id}>
                    <th scope="row">{color._id}</th>
                    <td> {color.name}</td>
                    <td>
                      <Link
                        className="btn btn-primary"
                        to={`/admin/editcolor/${color._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => distroy(e, color._id)}
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
    </div>
  );
}

export default IndexColor;
