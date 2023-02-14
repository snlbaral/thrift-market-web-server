import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

function ProductList(props) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("frontend/productall").then((response) => {
      console.log(response.data);

      setProducts(response.data);
      $("#myTable").DataTable();
    });
  }, []);

  function distroy(id) {
    axios
      .delete("/product/" + id)
      .then((response) => {
        console.log(response.data);
        const newcat = [...products];
        const index = newcat.findIndex((cat) => cat._id === id);
        newcat.splice(index, 1);
        setProducts(newcat);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }

  return (
    <div className="content-wrapper">
      <Link className="btn btn-secondary float-right" to="/admin/addproduct">
        ADD Product
      </Link>
      <div className="table-responsive mt-5">
        <table
          className="table table-light bg-white table-striped"
          id="myTable"
        >
          <thead>
            <tr className="trhead">
              <th scope="col">Name</th>
              <th scope="col">Detail</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
              <th scope="col">Brand</th>
              <th scope="col">Category </th>
              <th scope="col">Image</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              return (
                <tr key={product._id}>
                  <td> {product.name}</td>
                  <td>{product.detail}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  {product.brand_id ? (
                    <td>{product.brand_id.name}</td>
                  ) : (
                    <td></td>
                  )}
                  {product.category_id ? (
                    <td>{product.category_id.name}</td>
                  ) : (
                    <td></td>
                  )}

                  <td>
                    <img src={product.image} className="img-fluid w-25" />
                  </td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      to={`/editlist/${product._id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => distroy(product._id)}
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

export default ProductList;
