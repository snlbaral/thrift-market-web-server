import React from "react";

function ColorsFilterSkeleton({ counts = 8 }) {
  let arr = Array.apply(null, { length: counts }).map(Number.call, Number);
  return arr.map((a) => (
    <div key={a} className="skeleton category-filter-name"></div>
  ));
}

function ColorsFilter({ loading = false, colors, color_filter }) {
  if (loading) return <ColorsFilterSkeleton />;
  return colors.map((color) => {
    return (
      <div className="filters" key={color._id}>
        <div className="form-group form-check mb-1 d-flex align-items-center">
          <div className="cat-color" style={{ background: color.name }}></div>

          <input
            type="checkbox"
            className="form-check-input d-none"
            onChange={() => color_filter(color._id)}
            id={`color${color._id}`}
          />
          <label
            htmlFor={`color${color._id}`}
            className="category-checkbox"
          ></label>
          <label
            className="form-check-label text-capitalize mb-0 ml-1"
            htmlFor="Check1"
          >
            {color.name}
          </label>
        </div>
      </div>
    );
  });
}

export default ColorsFilter;
