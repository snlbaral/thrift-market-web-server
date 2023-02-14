import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useCartContext } from "../../global/CartContext";
import InterestItem from "./../../components/InterestItem";
import {
  apiErrorNotification,
  customErrorNotification,
} from "./../../global/Notification";

function Interest() {
  const [category_ids, setCategory_ids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submit, setSubmit] = useState(false);
  const history = useHistory();

  const { config, currentUser, setPageLoader } = useCartContext();

  async function getCategories() {
    try {
      let arr = [];
      const response = await axios.get("/category");
      for (const category of response.data) {
        arr = [...arr, ...category.childrens];
      }
      setCategories(arr);
    } catch (error) {}
  }

  useEffect(() => {
    if (categories.length && currentUser.interests.length) {
      var arr = [];
      for (const category of categories) {
        if (currentUser.interests.includes(category._id)) {
          arr.push(category._id);
        }
      }
      setCategory_ids(arr);
    }
  }, [categories, currentUser]);

  useEffect(() => {
    getCategories();
  }, []);

  function categoryClick(id) {
    if (category_ids.includes(id)) {
      var x = category_ids.filter((br) => br != id);
      setCategory_ids(x);
    } else {
      var b = [...category_ids, id];
      setCategory_ids(b);
    }
  }

  async function submitInterest(e) {
    e.preventDefault();
    setPageLoader(true);
    try {
      const data = {
        interests: category_ids,
      };
      await axios.post("/frontend/interests/feed", data, config);
      customErrorNotification("Interests saved");
      history.push("/");
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  return (
    <div className="container p-5">
      <form onSubmit={(e) => submitInterest(e)}>
        <div className="interest-section mx-auto">
          <div className="interest-title">Choose Your Preference</div>
          <div className="interest-card mb-4 d-flex align-items-center justify-content-center">
            {categories.map((category) => {
              return (
                <InterestItem
                  category={category}
                  categoryClick={categoryClick}
                  user={currentUser}
                />
              );
            })}
          </div>

          <button
            className="interest-submit-btn order-proceed text-center w-50 mx-auto d-flex justify-content-center align-items-center"
            disabled={category_ids.length ? false : true}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Interest;
