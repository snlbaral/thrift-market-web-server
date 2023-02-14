import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import $ from "jquery";

import DataTable from "react-data-table-component";
import { Oval } from "react-loader-spinner";

function IndexProduct(props) {
  const [products, setProducts] = useState([]);
  const [is_loader, setIs_loader] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  useEffect(() => {
    axios.get("/product").then((response) => {
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

  const columns = [
    {
      name: <th>Image</th>,
      cell: (item) => (
        <>
          <img src={item.image} className="py-2" width={70} />
        </>
      ),
    },
    {
      name: <th>Name</th>,
      selector: (item) => item.name,
      sortable: true,
    },
    {
      name: <th>Detail</th>,
      selector: (item) => item.detail,
      sortable: true,
    },
    {
      name: <th>Price</th>,
      selector: (item) => item.price,
      sortable: true,
    },
    {
      name: <th>Stock</th>,
      selector: (item) => item.stock,
      sortable: true,
    },

    {
      name: <th>Category</th>,
      selector: (item) => item.category_id?.name,
      sortable: true,
    },
    {
      name: <th>Brand</th>,
      selector: (item) => item.brand_id?.name,
      sortable: true,
    },
    {
      name: <th>SKU</th>,
      selector: (item) => item.sku,
      sortable: true,
    },
    {
      name: <th>Action</th>,
      cell: (item) => (
        <>
          <Link
            className="btn btn-primary mr-3"
            to={`/admin/editproduct/${item._id}`}
          >
            <i className="fa fa-pen-alt" />
          </Link>
          {deleteId == item._id ? (
            <button className="btn btn-danger" disabled>
              <Oval
                width={16}
                height={16}
                color="#fff"
                ariaLabel="loading"
                secondaryColor="#ddd"
                strokeWidth={4}
              />
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={(e) => distroy(item._id)}
            >
              <i className="fa fa-trash" />
            </button>
          )}
        </>
      ),
      grow: 2,
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="container-fluid px-5 mt-5 ">
        <DataTable
          columns={columns}
          data={products}
          pagination
          title="Product Lists"
          actions={
            <Link className="btn btn-primary" to="/admin/addproduct">
              Create
            </Link>
          }
          progressPending={is_loader}
          progressComponent={
            <Oval
              height="40"
              width="40"
              color="#590696"
              ariaLabel="loading"
              secondaryColor="#ddd"
              strokeWidth={4}
              wrapperStyle={{ marginBottom: "50px" }}
            />
          }
        />
      </div>

      {/* <Link className="btn btn-secondary float-right" to="/admin/addproduct">ADD Product</Link>
        <div className="table-responsive mt-5">
            <table className="table table-light bg-white table-striped" id="myTable">
            <thead>
            <tr className="trhead">
                
                <th scope="col">Name</th>
                <th scope="col">Detail</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col">Discount</th>
                <th scope="col">Brand</th>
                <th scope="col">Category </th>
                <th scope="col">Image</th>
                <th scope="col">Sku</th>
                <th scope="col">Action</th>

               
              </tr>
            </thead>
            
            <tbody>
            {products.map(product=>{
                return(
              <tr key={product._id}>
                <td> {product.name}</td>
                <td>{product.detail}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.discount}</td>
                {product.brand_id ?(
                  <td>{product.brand_id.name}</td>
                 )
                :(<td></td>)}
                {product.category_id ?(
                  <td>{product.category_id.name}</td>
                )
                :(<td></td>)}
             
               
                <td>
                <img src= {product.image} className="img-fluid w-25" />
                </td>
                <td>{product.sku}</td>
                <td>
                <Link className="btn btn-primary" to={`/admin/editproduct/${product._id}`}>Edit</Link>
                <button className="btn btn-danger" onClick={()=>distroy(product._id)}  >Delete</button>
                </td>
              </tr>
              )})}
            </tbody>
          
          </table>
          </div> */}
    </div>
  );
}

export default IndexProduct;
