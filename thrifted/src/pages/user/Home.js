import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import { Link } from "react-router-dom";
import PLUS from "../../plus.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";
import CartHover from "../../components/CartHover";
import Sellerdemo from "./../../components/Sellerdemo";
import Buyerdemo from "./../../components/Buyerdemo";
import { useCartContext } from "../../global/CartContext";
import CategoriesComponent from "../../components/home/CategoriesComponent";
import ProductsCard from "../../components/ProductsCard";
import CarouselBannerComponent from "./../../components/home/CarouselBannerComponent";
import CarouselProductsCard from "../../components/CarouselProductsCard";
import MostWantedBrand from "./../../components/home/MostWantedBrand";
import { apiErrorNotification } from "./../../global/Notification";

function Home(props) {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [view, setView] = useState("seller");
  const [rentProducts, setRentProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [topBanner, setTopBanner] = useState([]);
  const [middleBanner, setMiddleBanner] = useState([]);
  const [bottomBanner, setBottomBanner] = useState([]);
  const howitworksRef = useRef(null);

  const rentRef = useRef();

  async function getData() {
    try {
      const response = await axios.get("/frontend/home");
      setProducts(response.data.product);
      setCategories(response.data.categories);
      var Top = [];
      var Middle = [];
      var Bottom = [];
      response.data?.banner.map((banner) => {
        if (banner.section == "top") {
          Top.push(banner);
        } else if (banner.section == "middle") {
          Middle.push(banner);
        } else Bottom.push(banner);
      });
      setTopBanner(Top);
      setMiddleBanner(Middle);
      setBottomBanner(Bottom);
      setBanners(response.data.banner);
      setBrands(response.data.brand);
      setRentProducts(response.data.rentProduct);
      setSaleProducts(response.data.saleProduct);
      if (rentRef.current) {
        initCarousel();
      }
    } catch (error) {
      apiErrorNotification(error);
    }
  }

  function initCarousel() {
    $(".rent-carousel").slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  useEffect(() => {
    getData();
  }, [props]);

  useEffect(() => {
    if (props.location?.hash === "#howitwork" && howitworksRef.current) {
      howitworksRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [howitworksRef]);

  function changeBuyerSeller(abc) {
    setView(abc);
    if (abc == "buyer") {
      $(".changecolor").css("right", "0px");
      $(".changecolor").css("left", "auto");
    } else {
      $(".changecolor").css("right", "auto");
      $(".changecolor").css("left", "0px");
    }
  }

  return (
    <div>
      <CarouselBannerComponent banners={topBanner} />

      <section className="container py-5 my-5">
        <h3 className="newarrival mb-5 text-uppercase px-5 text-center">
          Top Categories
        </h3>
        <div className="cat-container">
          <CategoriesComponent categories={categories} />;
        </div>
      </section>
      <section>
        <div className="container-fluid py-5">
          <div className="container px-5">
            <h3 className="newarrival mb-5 text-uppercase">New Arrival</h3>
            <div className="row">
              <ProductsCard counts={8} products={products} />
            </div>
          </div>
        </div>
      </section>

      <section className="container" id="howitwork" ref={howitworksRef}>
        <h3 className="text-center m-5">HOW IT WORKS</h3>
        <div className="seller-buyer d-flex">
          <div onClick={(e) => changeBuyerSeller("seller")} className="seller">
            I Am a Seller
          </div>
          <div onClick={(e) => changeBuyerSeller("buyer")} className="seller">
            I Am a Buyer
          </div>
        </div>
        <div className="sellerbuyer-border">
          <div className="changecolor"></div>
        </div>
        <div className="row justify-content-center">
          {view == "seller" ? <Sellerdemo /> : <Buyerdemo />}
        </div>
      </section>

      <CarouselBannerComponent banners={middleBanner} />

      <section>
        <div className="container-fluid py-5 my-5">
          <div className="container px-5 ">
            <h3 className="newarrival mb-5 text-uppercase">
              Products For Rent
            </h3>
            <div className="row rent-carousel" ref={rentRef}>
              <CarouselProductsCard products={rentProducts} />
            </div>
          </div>
        </div>
      </section>

      <MostWantedBrand brands={brands} />

      <CarouselBannerComponent banners={bottomBanner} />

      <section>
        <div className="container-fluid py-5 my-5">
          <div className="container px-5">
            <h3 className="newarrival mb-5 text-uppercase">Product For Sale</h3>
            <div className="row">
              <ProductsCard counts={8} products={saleProducts} />
            </div>
          </div>
        </div>
      </section>

      <section className="support container">
        <h3>WE'VE GOT YOUR BACK</h3>
        <div className="support-wrapper">
          <div className="col-md-4 support-card">
            <div className=" card">
              <img src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/img-protected-payments-efde6b243c87ab8d708c9fbfef30620f.png" />
              <div className="support-heading">PROTECTED PAYMENTS</div>
              <div className="support-para">
                If it’s not what you ordered, we guarantee to give your money
                back.
              </div>
              <Link className="btn support-btn " to="#">
                View
              </Link>
            </div>
          </div>
          <div className="col-md-4 support-card">
            <div className="card">
              <img src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/img-shipping-7ebcbfb8d6516c51b4647c4575fa0011.png" />
              <div className="support-heading">EXPEDITED SHIPPING</div>
              <div className="support-para">
                All orders ship via USPS priority mail. With our pre-paid label,
                shipping has never been easier!
              </div>
              <Link className="btn support-btn " to="/expedited-shipping">
                View
              </Link>
            </div>
          </div>
          <div className="col-md-4 support-card">
            <div className="card">
              <img src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/img-posh-authenticate-61e405407123ad64eff678cd87acb3b1.png" />
              <div className="support-heading">24/7 Service</div>
              <div className="support-para">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa
                purus gravida.
              </div>
              <Link className="btn support-btn " to="#">
                View
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
