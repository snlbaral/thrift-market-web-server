import React from "react";
import { useState } from "react";

function CategoriesFilterSkeleton({ counts = 8 }) {
  let arr = Array.apply(null, { length: counts }).map(Number.call, Number);
  return arr.map((a) => (
    <div key={a} className="skeleton category-filter-name"></div>
  ));
}

function CategoriesFilter({ loading = false, categories, category_filter }) {
  if (loading) return <CategoriesFilterSkeleton />;
  return categories.map((category) => {
    return (
      <div className="filters" key={category._id}>
        <div className="form-group form-check mb-1">
          <input
            type="checkbox"
            className="form-check-input d-none"
            onChange={() => category_filter(category._id)}
            id={`cate${category._id}`}
          />
          <label
            for={`cate${category._id}`}
            className="category-checkbox"
          ></label>
          <Childs category={category} category_filter={category_filter} />
        </div>
      </div>
    );
  });
}

function Childs({ category, category_filter }) {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <label
        className="form-check-label text-capitalize ml-1 pointer"
        for="Check1"
        onClick={() => setIsShow(!isShow)}
      >
        {category.name} ({category.productcount})
      </label>
      {isShow ? (
        <i
          className="fa fa-minus"
          aria-hidden="true"
          onClick={() => setIsShow(!isShow)}
        ></i>
      ) : (
        <i
          className="fa fa-plus"
          aria-hidden="true"
          onClick={() => setIsShow(!isShow)}
        ></i>
      )}

      {isShow
        ? category.childrens.map((child) => {
            return (
              <div className="form-group form-check mb-1" key={child._id}>
                <input
                  type="checkbox"
                  className="form-check-input d-none"
                  onChange={() => category_filter(child._id)}
                  id={`cate${child._id}`}
                />
                <label
                  for={`cate${child._id}`}
                  className="category-checkbox"
                ></label>
                <label
                  className="form-check-label text-capitalize ml-1"
                  for="Check1"
                >
                  {child.name} ({child.productcount})
                </label>
              </div>
            );
          })
        : null}
    </>
  );
}

export default CategoriesFilter;
