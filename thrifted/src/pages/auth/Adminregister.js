import React, { useState } from "react";
import axios from "axios";

function Adminregister(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function register(e) {
    e.preventDefault();
    const data = {
      name,
      email,
      password,
    };
    axios.post("/user/admin", data).then((response) => {
      console.log(response.data);
      props.history.push("/");
    });
  }

  return (
    <div>
      <form className="w-50 mx-auto py-5" onSubmit={(e) => register(e)}>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Name</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            id="exampleInputPassword1"
            placeholder="user name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
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
            className="form-control"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Adminregister;
