import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { withRouter } from "react-router";
import jwt_decode from "jwt-decode";
import PageLoading from "./PageLoading";
import {
  apiErrorNotification,
  customSuccessNotification,
} from "./Notification";
import { useQuery } from "react-query";

export const AddContext = createContext();

export const useCartContext = () => useContext(AddContext);

function CartContext(props) {
  const [cart, setCart] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoader, setPageLoader] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const { isFetching } = useQuery(["current-user"], getUserData, {
    staleTime: 300000,
    onSuccess: ({ data }) => {
      console.log("success pickup location on web", data.user);
      setCurrentUser(data.user);
      if (data.user.is_seller == 1) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
      }
    },
  });

  const [config, setConfig] = useState({
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  });

  function retotal(cartitems) {
    var a = 0;
    var total = 0;
    cartitems.map((q) => {
      a += q.quantity;
      total += q.price * q.quantity;
    });
    setCart(a);
    setSubtotal(total);
    setCartItems(cartitems);
  }

  async function getCartData() {
    try {
      const response = await axios.get("/addtocart/cartcount", config);
      retotal(response.data);
    } catch (error) {
      // TODO: Cart API Error
    }
  }

  function getUserData() {
    const newconfig = {
      headers: {
        "access-token": localStorage.getItem("token"),
      },
    };
    setConfig(newconfig);
    return axios.get("/user/currentuser", newconfig);
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!isFetching) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      getCartData();
    } else {
      setIsLoading(false);
    }
  }, [props]);

  async function addtocartButton(pid, quantity, type = "/cartitems") {
    if (!localStorage.getItem("token")) {
      props.history.push("/login");
      return false;
    }
    setPageLoader(true);
    setCart(cart + quantity);
    const data = {
      pid,
      quantity,
    };
    try {
      await axios.post("/addtocart/cart", data, config);
      customSuccessNotification("Product added to cart");
      props.history.push(type);
    } catch (error) {
      apiErrorNotification(error);
    }
    setPageLoader(false);
  }

  if (isLoading) return <PageLoading />;

  return (
    <AddContext.Provider
      value={{
        cart,
        setCart,
        addtocartButton,
        cartItems,
        setCartItems,
        setIsLoading,
        pageLoader,
        setPageLoader,
        currentUser,
        setCurrentUser,
        subtotal,
        retotal,
        config,
        isSeller,
        setIsSeller,
      }}
    >
      {props.children}
    </AddContext.Provider>
  );
}

export default withRouter(CartContext);
