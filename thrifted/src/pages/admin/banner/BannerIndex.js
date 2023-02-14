import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

function BannerIndex() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios
      .get("/banner")
      .then((response) => {
        setBanners(response.data);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }, []);

  function distroy(id) {
    axios
      .delete("/banner/" + id)
      .then((response) => {
        console.log(response.data);
        const newbanner = [...banners];
        const index = newbanner.findIndex((banner) => banner._id === id);
        newbanner.splice(index, 1);
        setBanners(newbanner);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }
  return (
    <div className="content-wrapper">
      <Link className="btn btn-secondary float-right" to="/admin/addbanner">
        Add Banner
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
              <th scope="col">Name</th>
              <th scope="col">Link</th>
              <th scope="col">Image</th>
              <th scope="col">Banner Section</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner) => {
              return (
                <tr key={banner._id}>
                  <th scope="row">{banner._id}</th>
                  <td> {banner.title}</td>
                  <td> {banner.link}</td>
                  <td style={{ width: "15%" }}>
                    <img src={banner.image} className="img-fluid w-25" />
                  </td>
                  <td>{banner.section}</td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      to={`/admin/editbanner/${banner._id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => distroy(banner._id)}
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

export default BannerIndex;
