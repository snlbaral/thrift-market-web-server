import React, { useContext, useEffect, useRef, useState } from "react";
import $ from "jquery";
import axios from "axios";
import { useHistory } from "react-router";
import { useCartContext } from "../../../global/CartContext";
import FormCardSkeleton from "../../../components/FormCardSkeleton";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./../../../global/Notification";
import Select from "react-select";

function EditAddress(props) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const history = useHistory();
  const [div, setDiv] = useState("col-md-6");
  const [locations, setLocations] = useState([]);
  const cityRef = useRef();
  const municipalityRef = useRef();

  const { setPageLoader, config } = useCartContext();
  const [loading, setLoading] = useState(true);

  const [input, setInput] = useState({
    district: "",
    city: "",
    street: "",
    phone: "",
    name: "",
    zipcode: "0",
    municipality: "",
  });

  async function getAddressData() {
    try {
      const response = await axios.get("/user/pickup-location/get", config);
      setInput({
        name: response.data.name,
        city: response.data.city,
        district: response.data.district,
        phone: response.data.phone,
        street: response.data.street,
        zipcode: response.data.zipcode,
        municipality: response.data.municipality,
      });
      setLoading(false);
    } catch (error) {}
  }

  useEffect(() => {
    if (locations.length && input.district != "") {
      const filtered_municipalities = locations.filter(
        (loc) => loc.district == input.district
      );
      const municipality_array = filtered_municipalities.map(
        (a) => a.municipality
      );
      setMunicipalities([...new Set(municipality_array)]);

      const filtered_cities = locations.filter(
        (loc) => loc.municipality == input.municipality
      );
      const cities_array = filtered_cities.map((a) => a.city);
      setCities(cities_array);
    }
  }, [locations, loading]);

  async function getCityData() {
    axios.get("/location", config).then((response) => {
      setLocations(response.data);
      let district_array = response.data.map((a) => a.district);
      district_array = district_array.sort(function (a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
      });
      setDistricts([...new Set(district_array)]);
    });
  }

  useEffect(() => {
    getAddressData();
    getCityData();
    if (props.location.pathname.includes("checkout")) {
      setDiv("col-md-12");
    }
  }, [props]);

  async function editAdd(e) {
    setPageLoader(true);
    e.preventDefault();
    try {
      await axios.put(
        "/user/change-pickup-location/" + props.match.params.id,
        input,
        config
      );
      customSuccessNotification("Address Updated");
      localStorage.removeItem("shipping");
      localStorage.removeItem("billing");
      if (props.match.path == "/checkout") {
        history.push("/checkout");
      } else {
        props.history.goBack();
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
      setInput({
        ...input,
        municipality: null,
        city: null,
        [name]: value,
      });
    }
    if (name == "municipality") {
      const filter_city = locations.filter((loc) => loc.municipality == value);
      const city_array = filter_city.map((a) => a.city);
      setCities(city_array);
      setInput({
        ...input,
        city: null,
        [name]: value,
      });
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
    <div className="container mx-auto py-5">
      <div className={`${div} mx-auto py-5 editadd`}>
        {loading ? (
          <FormCardSkeleton />
        ) : (
          <form onSubmit={(e) => editAdd(e)}>
            <div class="col-12 mb-4">
              <div class="form-group mb-0">
                <h6 class="main-color">Address</h6>
              </div>
            </div>
            <div class="row mb-9 mx-auto pb-4">
              <div class="col-12 mb-4">
                <div class="form-group mb-0">
                  <label for="checkoutBillingPhone">Name</label>
                  <input
                    class="form-control form-control-sm"
                    id="checkoutBillingPhone"
                    name="name"
                    defaultValue={input.name}
                    onChange={(e) => change(e)}
                    type="text"
                    placeholder="Enter Name"
                    required
                  />
                </div>
              </div>

              <div class="col-12 mb-4">
                <div class="form-group mb-0">
                  <label for="checkoutBillingPhone">Mobile Phone</label>
                  <input
                    class="form-control form-control-sm"
                    id="checkoutBillingPhone"
                    name="phone"
                    defaultValue={input.phone}
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
                    value={{
                      label: input.district,
                      value: input.district,
                    }}
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
                    ref={municipalityRef}
                    value={{
                      label: input.municipality,
                      value: input.municipality,
                    }}
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
                    ref={cityRef}
                    value={{
                      label: input.city,
                      value: input.city,
                    }}
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
                    defaultValue={input.street}
                    name="street"
                    onChange={(e) => change(e)}
                    type="text"
                    placeholder="Country"
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
        )}
      </div>
    </div>
  );
}

export default EditAddress;
