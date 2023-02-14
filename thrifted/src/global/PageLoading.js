import React, { useEffect } from "react";
import { Oval } from "react-loader-spinner";
import $ from "jquery";

function PageLoading() {
  useEffect(() => {
    $(".home-loader svg").attr("viewBox", "-21.5 -21.5 45 45");
  }, []);
  return (
    <div className="home-loader">
      <Oval
        height={75}
        width={75}
        strokeWidth={3}
        color="rebeccapurple"
        secondaryColor="#bbb"
      />
    </div>
  );
}

export default PageLoading;
