import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyAddress from "../../../components/EmptyAddress";
import FormCardSkeleton from "../../../components/FormCardSkeleton";
import { useCartContext } from "../../../global/CartContext";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";

function UserAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { config, setPageLoader } = useCartContext();

  useEffect(() => {
    getAddress();
  }, []);

  async function getAddress() {
    try {
      const response = await axios.get("/address", config);
      setAddresses(response.data);
    } catch (error) {}
    setLoading(false);
  }

  async function deleteAddress(id) {
    setPageLoader(true);
    try {
      await axios.delete("/address/" + id, config);
      const item = addresses.filter((address) => address._id != id);
      setAddresses(item);
      customSuccessNotification("Address Deleted");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  if (loading) return <FormCardSkeleton />;

  return (
    <section>
      {!addresses.length && !loading ? (
        <EmptyAddress title="Add Address" link="/address" />
      ) : (
        <>
          <div className="card-header p-0 m-0 d-flex justify-content-between align-items-start">
            <h5 className="mb-0">My Address</h5>
            <Link to="/address" className="btn btn-dark btn-sm mb-2">
              <i className="fa fa-plus-circle"></i>
            </Link>
          </div>
          <div className="row justify-content-between pt-4">
            <div className="card checkout-card w-100">
              <h4 className="card-body checkout-header">Address</h4>
              <div className="card-body checkout-body user-address-card text-capitalize ml-0 mr-0">
                {addresses.map((address) => {
                  return (
                    <div className="row mb-3 mx-0">
                      <div className="col-md-8">
                        <p>Phone: {address.phone}</p>
                        <p>District: {address.district}</p>
                        <p>Municipality: {address.municipality}</p>
                        <p>City: {address.city}</p>
                        <p>Street: {address.street}</p>
                      </div>
                      <div className="col-md-4">
                        <Link
                          className="btn btn-warning btn-sm"
                          to={`/edit-address/${address._id}`}
                        >
                          <i className="fa fa-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm ml-3"
                          onClick={() => deleteAddress(address._id)}
                        >
                          <i className="fa fa-trash-o"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default UserAddress;
