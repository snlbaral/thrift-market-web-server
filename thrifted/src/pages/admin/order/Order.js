import React, { useEffect, useState } from "react";
import axios from "axios";

import $ from "jquery";

import DataTable from "react-data-table-component";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Select from "react-select";
import { apiErrorNotification } from "../../../global/Notification";

function Order() {
  const [items, setItems] = useState([]);
  const [is_loader, setIs_loader] = useState(true);
  const [deleteId, setDeleteId] = useState(0);

  const config = {
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    axios
      .get("/order/all", config)
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
        setIs_loader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function changeOrderStatus(e, id) {
    const data = {
      order_status: e.target.value,
      id,
    };
    axios.post("/order/orderstatus", data, config).then((response) => {
      console.log(response.data);
    });
  }

  const columns = [
    {
      name: <th>Image</th>,
      cell: (item) => (
        <>
          <img src={item.product_id?.image} className="py-2" width={70} />
        </>
      ),
    },
    {
      name: <th>Name</th>,
      selector: (item) => item.product_id?.name,
      sortable: true,
    },
    {
      name: <th>Price</th>,
      selector: (item) => item.price,
      sortable: true,
    },

    {
      name: <th>Quantity</th>,
      selector: (item) => item.quantity,
      sortable: true,
    },

    {
      name: <th>Action</th>,
      cell: (item) => (
        <>
          <select
            className="form-control"
            onChange={(e) => changeOrderStatus(e, item._id)}
          >
            {item.order_status == "processing" ? (
              <option value="processing" selected>
                Processing
              </option>
            ) : (
              <option value="processing">Processing</option>
            )}

            {item.order_status == "shipped" ? (
              <option value="shipped" selected>
                Shipped
              </option>
            ) : (
              <option value="shipped">Shipped</option>
            )}

            {item.order_status == "completed" ? (
              <option value="completed" selected>
                Completed
              </option>
            ) : (
              <option value="completed">Completed</option>
            )}
          </select>
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
          data={items}
          pagination
          title="Order Lists"
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
      {/* <div className="table-responsive mt-3">
            <table className="table table-light bg-white table-striped" id="myTable">
            <thead>
              <tr className="bg-dark text-white">
                
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Discount</th>
                <th scope="col">Brand</th>
                <th scope="col">Category </th>
                <th scope="col">Image</th>
                <th scope="col">Order Status</th>

              </tr>
            </thead>
            
            <tbody>
            {items.map(item=>{
              return(
                item.product_id? (

                
            <tr key={item._id}>
              <td> {item.product_id.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.discount}</td>
              {item.brand_id ?(
                <td>{item.brand_id.name}</td>
               )
              :(<td></td>)}
              {item.category_id ?(
                <td>{item.category_id.name}</td>
              )
              :(<td></td>)}
              <td>
              <img src= {item.product_id.image} className="img-fluid w-25" />
              </td>
                <td>
                <select className="form-control" onChange={(e)=>changeOrderStatus(e,item._id)}>
                {item.order_status=="processing"?(
                <option value="processing" selected>Processing</option>
                ):(
                  <option value="processing">Processing</option>
                )}

                {item.order_status=="shipped"?(
                  <option value="shipped" selected>Shipped</option>
                  ):(
                    <option value="shipped">Shipped</option>
                  )}

                  {item.order_status=="completed"?(
                    <option value="completed" selected>Completed</option>
                    ):(
                      <option value="completed">Completed</option>
                    )}
                </select>
                </td>
            </tr>
            ):(null)
            )})}
            </tbody>
          
          </table>
          </div> */}
    </div>
  );
}

export default Order;
