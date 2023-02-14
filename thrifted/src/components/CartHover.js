import React, { useContext } from "react";
import { AddContext } from "../global/CartContext";
import { withRouter } from "react-router-dom";

function CartHover(props) {
  const data = useContext(AddContext);
  const { addtocartButton } = data;

  async function cartButton(e, pid) {
    e.preventDefault();
    await addtocartButton(pid, 1);
  }

  return (
    <ul class="featured__item__pic__hover">
      <li>
        <a href="#">
          <i class="fa fa-heart"></i>
        </a>
      </li>
      <li>
        <a href="#">
          <i class="fa fa-retweet"></i>
        </a>
      </li>
      <li>
        <a href="#" onClick={(e) => cartButton(e, props.product_id)}>
          <i class="fa fa-shopping-cart"></i>
        </a>
      </li>
    </ul>
  );
}

export default withRouter(CartHover);
