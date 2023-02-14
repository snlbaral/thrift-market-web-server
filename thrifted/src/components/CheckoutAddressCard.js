import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

function CheckoutAddressCard({ address, addresses, handleChange, title }) {
  const [selectAddress, setSelectAddress] = useState(false);

  function createSelectOptions(addresses) {
    const arr = [];
    addresses.map((customer) => {
      arr.push({
        label: `${customer.name}, ${customer.district}, ${customer.street}`,
        value: `${customer._id}`,
      });
    });
    return arr;
  }
  function getDefaultValue() {
    const customer = addresses.find((customer) => customer._id == address._id);
    if (!customer) return null;
    return {
      label: `${customer.name}, ${customer.district}, ${customer.street}`,
      value: customer._id,
    };
  }

  return (
    <div className="card checkout-card">
      <h4 className="card-body checkout-header">{title}</h4>
      <div className="card-body checkout-body text-capitalize row ml-0 mr-0">
        <div className="col-md-7">
          <p>Phone: {address.phone}</p>
          <p>District: {address.district}</p>
          <p>City: {address.city}</p>
          <p>Street: {address.street}</p>
          <p>Postal Code: {address.zipcode}</p>
        </div>
        <div className="col-md-5">
          {!selectAddress ? (
            <div
              className="change-btn"
              role={"button"}
              onClick={() => setSelectAddress(true)}
            >
              Change
            </div>
          ) : (
            <div className="d-flex align-items-start">
              <Select
                className="basic-single mb-3 mr-2"
                classNamePrefix="select"
                options={createSelectOptions(addresses)}
                placeholder="Select Shipping Address"
                onChange={({ value }) => handleChange({ target: { value } })}
                defaultValue={getDefaultValue() || null}
                required={true}
              />

              <Link
                className="btn btn-warning btn-sm h-100"
                to={`/edit-address/${address._id}`}
              >
                <i className="fa fa-pencil"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutAddressCard;
