import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";

function AddAdmin(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  function creatAdmin(e) {
    e.preventDefault();
    const data = {
      name,
      email,
      password,
      role,
    };
    axios.post("/user/admin", data).then((response) => {
      console.log(response.data);
      $(".clear").val("");
      props.history.goBack();
    });
  }

  return (
    <div className="content-wrapper">
      <form className="w-50 mx-auto py-5" onSubmit={(e) => creatAdmin(e)}>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Name</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            className="form-control clear"
            id="exampleInputPassword1"
            placeholder="user name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control clear"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control  clear"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>
        <div className="form-group">
          <select
            className="form-control  clear"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddAdmin;
