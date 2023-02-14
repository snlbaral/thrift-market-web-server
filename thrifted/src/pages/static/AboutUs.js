import React from "react";
import IMG from "../../img/aboutus.png";

function AboutUs() {
  return (
    <div className="">
      <div className="img-div">
        <img src={IMG} className="img-fluid h-100" />
      </div>
      <div className="contact-wrapper pt-3">
        <div className="about-us-title">
          HamroCloset is a Only social marketplace in nepal for new and
          secondhand style for women, men, kids, and more.
        </div>

        <h3>Our Story</h3>
        <p className="our-story">
          Our story began in October 2022, when we realized that buying and
          selling of thrifted products is rarely used in the Nepali community.
          We felt people are tired of buying expensive clothes just for an event
          and are also searching for a place where they can sell their unused
          items. Hence, we decided to build this platform where not just a
          vendor but a normal customer can also put their product on display,
          which can be reused by other customers and earn from that sale. We
          have built a strong logistic network that ensures deliveries in most
          parts of the nation. Our aim is to make sure that our users and
          customers can buy products at affordable prices and get their products
          delivered on time regardless of their location.
        </p>

        <h3>Our Promises </h3>
        <section className="support container">
          <div className="support-wrapper">
            <div className="col-md-3 support-card">
              <div className=" card">
                <img src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/img-protected-payments-efde6b243c87ab8d708c9fbfef30620f.png" />
                <div className="support-heading">BEST PRICES</div>
              </div>
            </div>
            <div className="col-md-3 support-card">
              <div className="card">
                <img src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/img-shipping-7ebcbfb8d6516c51b4647c4575fa0011.png" />
                <div className="support-heading">EASY AND SPEED</div>
              </div>
            </div>
            <div className="col-md-3 support-card">
              <div className="card">
                <img src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/img-shipping-7ebcbfb8d6516c51b4647c4575fa0011.png" />
                <div className="support-heading">OnTime Delivery</div>
              </div>
            </div>
            <div className="col-md-3 support-card">
              <div className="card">
                <img src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/img-posh-authenticate-61e405407123ad64eff678cd87acb3b1.png" />
                <div className="support-heading">100% PROTECTED</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
