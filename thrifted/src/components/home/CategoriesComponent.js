import React from "react";
import { Link } from "react-router-dom";

function CategoriesComponentSkeleton() {
  let arr = Array.apply(null, { length: 12 }).map(Number.call, Number);
  return arr.map((a) => {
    return (
      <section key={a}>
        <p className="skeleton home-category-image-skeleton"></p>
        <div className="skeleton home-category-name-skeleton"></div>
      </section>
    );
  });
}

function CategoriesComponent({ categories = [] }) {
  if (!categories.length) return <CategoriesComponentSkeleton />;
  return categories.map((category) => {
    return (
      <div key={category._id}>
        <Link to={`category/${category.slug}`}>
          <figure className="cat-figure">
            <img src={category.image} className="img-fluid " />
            <div className="cat-caption">{category.name}</div>
          </figure>
        </Link>
      </div>
    );
  });
}

export default CategoriesComponent;
