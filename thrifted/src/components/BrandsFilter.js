import React from "react";

function BrandsFilterSkeleton({ counts = 8 }) {
  let arr = Array.apply(null, { length: counts }).map(Number.call, Number);
  return arr.map((a) => (
    <div key={a} className="skeleton category-filter-name"></div>
  ));
}

function BrandsFilter({ loading = false, brands, brand_filter }) {
  if (loading) return <BrandsFilterSkeleton />;
  return brands.map((brand) => {
    return (
      <div className="filters" key={brand._id}>
        <div className="form-group form-check mb-1">
          <input
            type="checkbox"
            className="form-check-input d-none"
            onChange={() => brand_filter(brand._id)}
            id={`brand${brand._id}`}
          />
          <label
            htmlFor={`brand${brand._id}`}
            className="category-checkbox"
          ></label>
          <label
            className="form-check-label text-capitalize ml-1"
            htmlFor="Check1"
          >
            {brand.name} ({brand.productcount})
          </label>
        </div>
      </div>
    );
  });
}

export default BrandsFilter;
