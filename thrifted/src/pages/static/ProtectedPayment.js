import React from "react";

function ProtectedPayment(props) {
  return (
    <section className="container pt-7 pb-12  py-5">
      <div className="col-12 text-center inner-header">
        <h3>Protected Payment</h3>
      </div>

      <div className="protected-title">
        <div className="pro-header">
          You are protected every time you make a purchase on Poshmark.
        </div>
        <div className="pro-para">
          We will give you a full refund if your item never ships or does not
          match the listing description. Otherwise, all sales are final. The
          policies and systems we have in place to protect you are called Posh
          Protect.
        </div>
        <hr />
      </div>
      <div className="protected-title">
        <div className="pro-header">Refund Policy</div>
        <div className="pro-para">
          When you make a purchase on Poshmark, we don't release payment to the
          seller until you tell us you've received your order as described. You
          have 3 days after delivery to inform us if the item has been
          misrepresented by reporting the problem in the Poshmark app or website
          with supporting photos. If we verify your claim, we'll send you a
          label to return the order to the seller and refund your payment. All
          returns must be shipped back within 5 days of approval to be eligible
          for a refund.
        </div>
        <hr />
      </div>

      <div className="protected-title">
        <div className="pro-header">What is covered</div>
        <div className="pro-para">
          If any of the following pertain to your order, please report the
          problem in the Poshmark app or website immediately:
          <ul>
            <li>Undisclosed damage</li>
            <li>Incorrect or missing item</li>
            <li>Item not as described</li>
            <li>Item is not authentic</li>
          </ul>
          If no claim is made within 3 days of delivery, payment will be
          automatically released to the seller. Once payment has been released,
          all sales are final and no refunds will be provided.
        </div>
        <hr />
      </div>

      <div className="protected-title">
        <div className="pro-header">What is not covered</div>
        <div className="pro-para">
          <h6 className="mt-3">Item does not fit / changed mind</h6>
          If the item is just not your style or does not fit you, we
          unfortunately cannot accept a return. You can always re-list the item
          on Poshmark!
          <h6 className="mt-3">Trades and Offline Transactions</h6>
          Posh Protect does not cover trades or transactions completed off of
          the Poshmark platform. When payment for the full value of items is not
          exchanged through the Poshmark platform, we cannot guarantee that both
          parties will ship and transact as promised. You bear all risks
          associated with any such transactions.
        </div>
        <hr />
      </div>
    </section>
  );
}

export default ProtectedPayment;
