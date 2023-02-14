import React from "react";
import captureImg from "../img/click.jpeg";
import postImg from "../img/post.jpeg";
import earnImg from "../img/cash.jpeg";

function Sellerdemo() {
  return (
    <div className="container justify-content-center m-5 seller">
      <div className="row mb-5 justify-content-center">
        <div className="col-md-9">
          <div className="row">
            <div className="col-md-6 step">
              <div className="ep">
                STEP<div>01</div>
              </div>
              <div className="seller-card card">
                <img src={captureImg} className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6 desc">
              <h3>LIST IT</h3>
              <hr />
              <p>
                Take a photo and upload to your closet in less than 60
                seconds–right from your phone!
              </p>
            </div>
          </div>

          <div className="row mb-5">
            <div className=" col-md-6 step">
              <h3> SHARE IT</h3>
              <hr />
              <p>
                Share listings to your network for shoppers to discover! More
                sharing = more sales
              </p>
            </div>
            <div className="col-md-6 desc">
              <div className="seller-card card">
                <div className=" ep ep-right">
                  STEP<div>02</div>
                </div>
                <img src={postImg} className="img-fluid" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 step">
              <div className="seller-card card">
                <div className="ep">
                  STEP<div>03</div>
                </div>
                <img src={earnImg} className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6 desc">
              <h3>EARN CASH</h3>
              <hr />
              <p>
                Shipping is easy with our pre-paid label, and you’ll get cash in
                your pocket when the item is delivered!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sellerdemo;
