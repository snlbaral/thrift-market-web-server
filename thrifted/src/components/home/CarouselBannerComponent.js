import React from "react";
import PageLoading from "../../global/PageLoading";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function TopBannerSkeleton() {
  return <div className="skeleton top-banner"></div>;
}

function CarouselBannerComponent({ banners = [] }) {
  if (!banners.length) return <TopBannerSkeleton />;

  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      showIndicators={false}
      dynamicHeight={true}
      interval={5000}
    >
      {banners.map((banner, index) => {
        return (
          <div key={index}>
            <img
              className="d-block w-100"
              src={banner.image}
              alt="First slide"
            />
          </div>
        );
      })}
    </Carousel>
  );
}

export default CarouselBannerComponent;
