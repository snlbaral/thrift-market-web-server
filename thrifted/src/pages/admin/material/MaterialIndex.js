import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";
import OrderTrackModal from "../../../components/OrderTrackModal";
import { apiErrorNotification } from "./../../../global/Notification";

function MaterialIndex() {
  const [materials, setMaterials] = useState([]);
  const [is_loader, setIs_loader] = useState(true);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    getMaterials();
  }, []);

  async function getMaterials() {
    try {
      const response = await axios.get("/frontend/materials/get");
      setMaterials(response.data);
      setIs_loader(false);
    } catch (error) {
      apiErrorNotification(error);
    }
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
      name: <th>SKU</th>,
      selector: (item) => item.sku,
      sortable: true,
    },
    {
      name: <th>Detail</th>,
      selector: (item) => item.detail,
      sortable: true,
    },
    {
      name: <th>Size</th>,
      selector: (item) => item.size,
      sortable: true,
    },
    {
      name: <th>Action</th>,
      cell: (item) => (
        <>
          <button className="btn btn-primary btn-sm mr-3">Delete</button>
        </>
      ),
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="container-fluid px-5 mt-5 ">
        <DataTable
          columns={columns}
          data={materials}
          pagination
          progressPending={is_loader}
          actions={
            <Link className="btn btn-primary" to="/admin/material/create">
              Create
            </Link>
          }
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
    </div>
  );
}

export default MaterialIndex;
