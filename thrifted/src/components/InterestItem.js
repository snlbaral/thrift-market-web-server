import React, { useEffect, useState } from "react";

function InterestItem({ categoryClick, category, user }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (user && user.interests) {
      setActive(user.interests.includes(category._id) ? true : false);
    }
  }, [user]);

  function CategoryToggle() {
    setActive(!active);
    categoryClick(category._id);
  }
  return (
    <div
      className={`interest-category ${active ? "active" : ""}`}
      onClick={() => CategoryToggle()}
    >
      {category.name}
    </div>
  );
}

export default InterestItem;
