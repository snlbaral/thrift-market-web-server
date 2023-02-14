import React from "react";
import { Link } from "react-router-dom";

function SellerRequest(props) {
  return (
    <main className=" sr-container">
      <section>
        <div className="main-img">
          <img
            src="https://www.swap.com/a/2892/img/premier-seller/premier-seller-program-desktop.webp"
            className="img-fluid w-100"
          />
        </div>
      </section>
      <section>
        <div className="row sr-row sr-row">
          <div className="col-md-6 text-row">
            <h2 className="mb-3">Quality Commitment</h2>
            <p>
              We are looking for sellers to partner with who can help us provide
              quality clothing our customers are looking for. Doing so will help
              us collectively reduce waste by giving more clothes a new home.
            </p>
          </div>

          <div className="col-md-6">
            <img
              src="https://www.swap.com/a/2892/img/premier-seller/quality-commitment.webp"
              className="img-fluid"
            />
          </div>
        </div>
        <div className="row sr-row">
          <div className="col-md-6">
            <img
              src="https://www.swap.com/a/2892/img/premier-seller/premium-experience.webp"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 text-row">
            <h2>Competitive Commission Rates</h2>
            <p>
              We offer the most competitive rates in the market and provide a
              more hands-on experience—sharing tips with our sellers to help
              them realize long-term success.
            </p>
          </div>
        </div>
      </section>
      <section className="svg-icons svgiconsection">
        <h4 className="text-center">How It Works</h4>
        <div className="row sr-row">
          <div className="col-md-4 icondiv">
            <div className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 708.04 708.04"
              >
                <title>Magnifier</title>
                <g>
                  <path d="M696.16,638.77,466.52,409.13l-8,8-46.06-46.06a243.66,243.66,0,0,1-41.35,41.35l46.06,46.06-8,8L638.77,696.16a40.58,40.58,0,0,0,57.39-57.39Z"></path>
                  <path d="M442,221A221,221,0,0,0,64.73,64.73,221,221,0,1,0,377.27,377.27,219.56,219.56,0,0,0,442,221ZM221,406A183.82,183.82,0,0,1,90.18,351.81c-72.13-72.13-72.13-189.49,0-261.63a185,185,0,0,1,261.63,0c72.13,72.14,72.13,189.5,0,261.63A183.8,183.8,0,0,1,221,406Z"></path>
                  <path d="M369.29,186.8C350.43,105,268.57,53.85,186.8,72.71a10,10,0,0,0,4.49,19.49c71-16.38,142.13,28.08,158.51,99.1a10,10,0,0,0,9.73,7.75,9.74,9.74,0,0,0,2.26-.26A10,10,0,0,0,369.29,186.8Z"></path>
                </g>
              </svg>
            </div>
            <div className="svg-text">
              <h4>Read Our Acceptance Rules</h4>
              <p>
                We only accept quality items our secondhand shoppers will love.
                Clean out your closet and inspect items for wear & tear. (Psst.
                Think, "Would I sell this to an acquaintance?"){" "}
              </p>
            </div>
          </div>
          <div className="col-md-4 icondiv">
            <div className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 545.06 726.24"
              >
                <title>Checklist</title>
                <g>
                  <path d="M300.33,604.07H52.19V195.59H407.47V484a134.78,134.78,0,0,1,56.07.74V119.35A35.44,35.44,0,0,0,428.21,84H351.05v26.71a34.42,34.42,0,0,1-34.32,34.33H146.81a34.43,34.43,0,0,1-34.33-34.33V84H35.32A35.43,35.43,0,0,0,0,119.35V616.81a35.43,35.43,0,0,0,35.32,35.32H305a134,134,0,0,1-5.15-36.89C299.86,611.48,300,607.76,300.33,604.07Z"></path>
                  <path d="M167.53,520.8l-39,40.76a9.16,9.16,0,0,1-12.93.28l-.06-.06L93.21,543.4A8.72,8.72,0,0,1,92,531.15l.56-.68a8.72,8.72,0,0,1,12.25-1.18l16.33,13.46,33.14-34.6a9.15,9.15,0,1,1,13.21,12.65Zm0-89.26-39,40.77a9.17,9.17,0,0,1-12.93.28l-.06-.06L93.21,454.15A8.74,8.74,0,0,1,92,441.89l.56-.68A8.73,8.73,0,0,1,104.85,440l16.33,13.47,33.14-34.61a9.15,9.15,0,0,1,13.21,12.65Zm0-91.54-39,40.77a9.17,9.17,0,0,1-12.93.28l-.06-.07L93.21,362.61A8.74,8.74,0,0,1,92,350.35l.56-.68a8.73,8.73,0,0,1,12.25-1.18L121.18,362l33.14-34.61A9.15,9.15,0,0,1,167.53,340Zm0-91.54-39,40.76a9.16,9.16,0,0,1-12.93.28l-.06-.06L93.21,271.06A8.72,8.72,0,0,1,92,258.81l.56-.68A8.72,8.72,0,0,1,104.85,257l16.33,13.46,33.14-34.6a9.15,9.15,0,1,1,13.21,12.65ZM299.86,537.52a12.58,12.58,0,0,1-12.55,12.55h-87.8A12.59,12.59,0,0,1,187,537.52v-7.7a12.59,12.59,0,0,1,12.55-12.55h87.8a12.58,12.58,0,0,1,12.55,12.55Zm19.46-91.76a13.57,13.57,0,0,1-13.53,13.53H201.64a13.57,13.57,0,0,1-13.53-13.53V440a13.57,13.57,0,0,1,13.53-13.53H305.79A13.57,13.57,0,0,1,319.32,440Zm32-81.37a12.55,12.55,0,0,1-12.51,12.51H200.62a12.55,12.55,0,0,1-12.51-12.51v-7.78a12.55,12.55,0,0,1,12.51-12.51H338.85a12.55,12.55,0,0,1,12.51,12.51Zm22.12-89.45a11.6,11.6,0,0,1-11.56,11.57H199.67a11.6,11.6,0,0,1-11.56-11.57v-9.67a11.6,11.6,0,0,1,11.56-11.57H361.92a11.6,11.6,0,0,1,11.56,11.57Z"></path>
                  <path d="M315.4,60.81h0C304,49,273.12,51.68,273.12,51.68c-7.63-1.14-8-10.49-8-10.49C266-.57,229.83,0,229.83,0s-36.14-.57-35.28,41.19c0,0-.38,9.35-8,10.49,0,0-30.88-2.64-42.28,9.12h0a28.61,28.61,0,0,0-9.5,21.26v2.54a28.76,28.76,0,0,0,28.68,28.67H296.22A28.76,28.76,0,0,0,324.9,84.61V82.07A28.61,28.61,0,0,0,315.4,60.81ZM229.83,48.63a13.54,13.54,0,1,1,13.54-13.54A13.54,13.54,0,0,1,229.83,48.63Z"></path>
                  <path d="M429.33,494.77A115.74,115.74,0,1,0,545.06,610.5,115.73,115.73,0,0,0,429.33,494.77Zm-2.2,195.08a20.36,20.36,0,0,1-23.41,6.4,20.14,20.14,0,0,1-5.74-3.13l-52.44-40.88A20.57,20.57,0,0,1,342,623.45h0a20.58,20.58,0,0,1,28.79-3.56l36.63,28.55,75.36-96.67a20.35,20.35,0,0,1,28.49-3.53l.34.26A20.36,20.36,0,0,1,515.11,577Z"></path>
                </g>
              </svg>
            </div>
            <div className="svg-text">
              <h4>Sign Up and List</h4>
              <p>
                Sign up and send your initial items to us. If accepted, we will
                do the heavy lifting (processing, pricing, photos, etc.) and you
                can sit back and start making $$!{" "}
              </p>
            </div>
          </div>
          <div className="col-md-4 icondiv">
            <div className="icons">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 58">
                <title>Money</title>
                <path d="M33,16.13C32.78,14,35,12,38,12s5.21,2,5,4.13S40.53,20,38,20,33.25,18.31,33,16.13ZM52,37.5a4.64,4.64,0,0,1-4,4.41,4.37,4.37,0,0,1,2,3.59A4.77,4.77,0,0,1,45,50h-.89A4.34,4.34,0,0,1,46,53.5,4.77,4.77,0,0,1,41,58H35c-12.42,0-13.26-5.3-23-5.94V28c12,0,10-8,16-8l.06.07c-1.1-5.18-2.7-9.82-4-16.63a1.22,1.22,0,0,1,1-1.25c10.27-2.92,15.71-2.92,26,0a1.24,1.24,0,0,1,1,1.26C50.31,11.92,48.24,17,47.23,24A4.88,4.88,0,0,1,52,28.8a4.8,4.8,0,0,1-3.28,4.49A4.54,4.54,0,0,1,52,37.5ZM28.54,8.55c1.12,6,2.13,9.33,2.79,14.5,1.28.58,3.23.95,6.67.95h6.56c.66-5.72,1.72-9.08,2.9-15.45-2.67-.47-4-1.8-4.15-4.37-4.27-1-6.44-.8-10.62,0A4.29,4.29,0,0,1,28.54,8.55ZM8.32,26H1.68A1.68,1.68,0,0,0,0,27.68V54.32A1.68,1.68,0,0,0,1.68,56H8.32A1.68,1.68,0,0,0,10,54.32V27.68A1.68,1.68,0,0,0,8.32,26Z"></path>
              </svg>
            </div>
            <h4>Earn It!!</h4>
            <div className="svg-text">
              <p>
                Assuming your first set of items meet our acceptance criteria,
                you will be invited to become a Premier Seller. This means you
                can continue to send in items anytime and start earning some
                real $$!{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="test-pass">
        <div className="row sr-row">
          <div className="col-md-6">
            <img
              src="https://www.swap.com/a/2892/img/premier-seller/fit-in.webp"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <div className="col-md-12 text-row">
              <h4>Do My Items Pass the Test?</h4>
              <table className="text-left">
                <tbody>
                  <tr>
                    <td>
                      <span className="iconcheck">✓ </span>
                    </td>
                    <td>
                      <span className="checkp">
                        I would be proud to sell these items to friends or loved
                        ones.
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="iconcheck">✓ </span>
                    </td>
                    <td>
                      <span className="checkp">
                        They are free of wear & tear such as pilling, fading,
                        stretching, or
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="iconcheck">✓ </span>
                    </td>
                    <td>
                      <span className="checkp">
                        They are not damaged or altered. No stains, holes, rips,
                        zippers broken, or buttons missing.
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="tips">
        <div className="row sr-row">
          <div className="col-md-6 text-row d-flex align-items-center justify-content-center">
            <div className="col-md-10 ">
              <p>
                Receive tips & tricks from Swap's Premier Selling Team on what
                brands or items customers want in order to help you sell quality
                items, faster.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <img
              src="https://www.swap.com/a/2892/img/premier-seller/selling-team.webp"
              className="img-fluid"
            />
          </div>
        </div>

        <div className="row sr-row">
          <div className="col-md-6 ">
            <img
              src="https://www.swap.com/a/2892/img/premier-seller/packing.webp"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 text-row d-flex align-items-center justify-content-center">
            <div className="col-md-10">
              <p>
                {" "}
                Print pre-paid shipping label and mail items to Swap.com’s
                quality inspection team. We take care of the rest and will let
                you know when your items are listed on Swap.com.
              </p>
            </div>
          </div>
        </div>
        <div className="row sr-row">
          <div className="col-md-6 text-row text-row d-flex align-items-center justify-content-center">
            <div className="col-md-10">
              <p>
                We will promote items on your behalf and notify you when your
                items are purchased. You'll be able to track corresponding cash,
                credit, or donation earnings you've made each month.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <img
              src="https://www.swap.com/a/2892/img/premier-seller/success.webp"
              className="img-fluid"
            />
          </div>
        </div>
      </section>
      <div className="start botton text-center mb-5 pb-5">
        {localStorage.getItem("token") ? (
          <Link to="/create-post" className="btn btn-danger btn-lg w-25">
            Get Started
          </Link>
        ) : (
          <Link to="/register" className="btn btn-danger btn-lg w-25">
            Get Started
          </Link>
        )}
      </div>
    </main>
  );
}

export default SellerRequest;
