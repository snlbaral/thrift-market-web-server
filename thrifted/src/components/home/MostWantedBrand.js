import React from "react";
import { Link } from "react-router-dom";

function MostWantedBrandSkeleton() {
  return <div className="skeleton most-wanted-brand"></div>;
}

function MostWantedBrand({ brands = [] }) {
  if (!brands.length) return <MostWantedBrandSkeleton />;
  return (
    <section className="brand">
      <div className="container brand-container">
        <h3 className="text-center">MOST-WANTED BRANDS</h3>
        <div className="row justify-content-center">
          <div className="col-md-12 px-5">
            <div className="row">
              {brands.map((brand) => {
                return (
                  <div className="col-md-2 mb-3" key={brand._id}>
                    <Link to={`/brand/${brand.slug}`}>
                      <div className="brand-card">
                        <figure className="brand-figure">
                          <img src={brand.image} />
                        </figure>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MostWantedBrand;
