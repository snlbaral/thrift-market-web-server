import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

function UserProtected(props) {
  const CMP = props.cmp;

  useEffect(() => {
    if (localStorage.getItem("token")) {
    } else props.history.push("/");
  }, [props]);

  return <CMP {...props} />;
}

export default withRouter(UserProtected);
