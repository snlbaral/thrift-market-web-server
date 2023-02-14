import React, { useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

function AdminProtected(props) {
  let Cmp = props.Cmp;

  useEffect(() => {
    const config = {
      headers: {
        "access-token": localStorage.getItem("token"),
      },
    };

    axios
      .get("/user/admin", config)
      .then((response) => {})
      .catch((err) => {
        props.history.push("/");
      });
  }, [props]);

  return <Cmp {...props} />;
}

export default withRouter(AdminProtected);
