import React from "react";
import watchingImg from "../img/watching.png";
import packImg from "../img/pack.png";
import detailImg from "../img/detail.png";

function Buyerdemo() {
  return (
    <div className="container justify-content-center m-5 seller">
      <div className="row mb-5 justify-content-center">
        <div className="col-md-9">
          <div className="row">
            <div className="col-md-6 step">
              <div className="ep">
                STEP<div>01</div>
              </div>
              <div className="buyer-card card">
                <img src={watchingImg} className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6 desc">
              <h3>DISCOVER ITEMS</h3>
              <hr />
              <p>
                From women to men to kids, discover a wide selection of items
                across thousands of brands—at prices up to 70% off!
              </p>
            </div>
          </div>

          <div className="row mb-5">
            <div className=" col-md-6 step">
              <h3>GET STYLED</h3>
              <hr />
              <p>
                Find the perfect look with personalized recommendations from
                millions of stylists, right at your fingertips.
              </p>
            </div>
            <div className="col-md-6 desc">
              <div className="buyer-card card">
                <div className=" ep ep-right">
                  STEP<div>02</div>
                </div>
                <img src={detailImg} className="img-fluid" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 step">
              <div className="buyer-card card">
                <div className="ep">
                  STEP<div>03</div>
                </div>
                <img src={packImg} className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6 desc">
              <h3>SPREAD THE LOVE</h3>
              <hr />
              <p>
                Orders arrive in two days with Priority Mail shipping. If you
                love it, leave the seller a note to let them know!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buyerdemo;
