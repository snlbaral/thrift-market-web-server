import React from "react";
import IMG from "../../img/return.png";

function ReturnRefund() {
  return (
    <div className="privacy-policy-section">
      <div className="img-div">
        <img src={IMG} className="img-fluid h-100" />
      </div>
      <div className="contact-wrapper pt-5">
        <p>
          Thrift Market may allow you to return an Item in limited
          circumstances. If the Item you receive is not as described on the
          Service, then you may request a return by reporting the issue through
          the Service or by emailing <b>support@hamrocloset.com</b>, in each
          case within three days after delivery (as determined by the tracking
          information on the Label) of the Item.
        </p>
        <br />
        <p>
          We will give you a full refund if your item never ships or does not
          match the listing description. Otherwise, all sales are final.{" "}
        </p>
        <h3>Refund Policy</h3>
        <p>
          When you make a purchase on Thrift Market, we don't release payment to
          the seller until you tell us you've received your order as described.
          You have 3 days after delivery to inform us if the item has been
          misrepresented by reporting the problem by mailing to
          <b>support@hamrocloset.com</b> with supporting photos. If we verify
          your claim, we'll send you a label to return the order to the seller
          and refund your payment. All returns must be shipped back within 5
          days of approval to be eligible for a refund.
        </p>
        <h3>What is covered</h3>
        <p>
          If any of the following pertain to your order, please report the
          problem in the Thrift Market app or website immediately:
          <ol>
            <li>Undisclosed damage</li>
            <li>Incorrect or missing item</li>
            <li>Item not as described</li>
            <li>Item is not authentic</li>
          </ol>
          If no claim is made within 3 days of delivery, payment will be
          automatically released to the seller. Once payment has been released,
          all sales are final and no refunds will be provided.
        </p>
        <h3>What is not covered</h3>

        <b>Item does not fit / changed mind</b>
        <p>
          If the item is just not your style or does not fit you, we
          unfortunately cannot accept a return. You can always re-list the item
          on Thrift Market!
        </p>
        <b>Trades and Offline Transactions</b>
        <p>
          Refund policy does not cover trades or transactions completed off of
          the Thrift Market platform. When payment for the full value of items
          is not exchanged through the Thrift Market platform, we cannot
          guarantee that both parties will ship and transact as promised. You
          bear all risks associated with any such transactions.
        </p>
      </div>
    </div>
  );
}

export default ReturnRefund;
