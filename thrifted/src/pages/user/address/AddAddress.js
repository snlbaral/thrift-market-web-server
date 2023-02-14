import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import $ from "jquery";
import { useHistory, withRouter } from "react-router";
import { useCartContext } from "../../../global/CartContext";
import Select from "react-select";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";

function AddAddress(props) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [div, setDiv] = useState("col-md-6");
  const history = useHistory();

  const [input, setInput] = useState({
    city: "",
    district: "",
    street: "",
    phone: "",
    name: "",
    zipcode: "0",
    municipality: "",
  });

  const [shipdetail, setShipdetail] = useState(false);

  const { setPageLoader, config } = useCartContext();

  useEffect(() => {
    axios.get("/location", config).then((response) => {
      setLocations(response.data);
      let district_array = response.data.map((a) => a.district);
      district_array = district_array.sort(function (a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
      });
      setDistricts([...new Set(district_array)]);
      const cities_array = response.data.map((a) => a.city);
      setCities(cities_array);
      const municipaliti_array = response.data.map((a) => a.municipality);
      setMunicipalities([...new Set(municipaliti_array)]);
    });
    if (props.location.pathname.includes("checkout")) {
      setDiv("col-md-12");
    }
  }, [props]);

  async function addAddress(e) {
    e.preventDefault();
    setPageLoader(true);
    try {
      await axios.post("/address", input, config);
      customSuccessNotification("Address Added.");
      if (props.checkout) {
        history.push("/checkout");
      } else {
        history.goBack();
      }
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  function change(e) {
    filterMunicipalityCity(e.target.name, e.target.value);
  }

  function filterMunicipalityCity(name, value) {
    setInput({
      ...input,
      [name]: value,
    });
    if (name === "district") {
      const filter_municipality = locations.filter(
        (loc) => loc.district == value
      );
      const municipaliti_array = filter_municipality.map((a) => a.municipality);
      setMunicipalities([...new Set(municipaliti_array)]);
    }
    if (name == "municipality") {
      const filter_city = locations.filter((loc) => loc.municipality == value);
      const city_array = filter_city.map((a) => a.city);
      setCities(city_array);
    }
  }

  function formatToReactSelect(options) {
    const arr = [];
    options.map((opt) => {
      arr.push({
        label: opt,
        value: opt,
      });
    });
    return arr;
  }

  return (
    <div className="container  mx-auto py-5">
      <div class={` ${div} mx-auto  py-5 editadd`}>
        <form onSubmit={(e) => addAddress(e)}>
          <div class="col-12 mb-4">
            <div class="form-group mb-0">
              <h6 class="main-color">Add Address</h6>
            </div>
          </div>
          <div class="row mb-9 mx-auto py-4">
            <div class="col-12 mb-4">
              <div class="form-group mb-0">
                <label>Name</label>
                <input
                  class="form-control form-control-sm"
                  name="name"
                  onChange={(e) => change(e)}
                  type="name"
                  placeholder="Enter Name"
                  required
                />
              </div>
            </div>

            <div class="col-12 mb-4">
              <div class="form-group mb-0">
                <label>Mobile Phone</label>
                <input
                  class="form-control form-control-sm"
                  name="phone"
                  onChange={(e) => change(e)}
                  type="tel"
                  placeholder="Mobile Phone"
                  required
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div className="form-group mb-0">
                <label className="">District</label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="district"
                  options={formatToReactSelect(districts)}
                  placeholder="Please Select District"
                  onChange={({ value }) =>
                    filterMunicipalityCity("district", value)
                  }
                  required={true}
                />
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div className="form-group">
                <label className="">Municipality</label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="municipality"
                  options={formatToReactSelect(municipalities)}
                  placeholder="Please Select Municipality"
                  onChange={({ value }) =>
                    filterMunicipalityCity("municipality", value)
                  }
                  required={true}
                />
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div className="form-group">
                <label className="">City</label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="city"
                  options={formatToReactSelect(cities)}
                  placeholder="Please Select City"
                  onChange={({ value }) =>
                    filterMunicipalityCity("city", value)
                  }
                  required={true}
                />
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label for="checkoutBillingCountry">Street</label>
                <input
                  class="form-control form-control-sm"
                  id="checkoutBillingCountry"
                  name="street"
                  onChange={(e) => change(e)}
                  type="text"
                  placeholder="XYZ-1, ABC Tol, House #1, Near Landmark"
                  required
                />
              </div>
            </div>
          </div>

          <div class="col-12">
            <button type="submit" className="btn  order-proceed mt-3 w-25">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRouter(AddAddress);
