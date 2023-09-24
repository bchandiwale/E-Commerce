import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { withContext } from "../withContext";

const Login = ({ context }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
    setError("");
  };

  const login = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Fill all fields!");
      return;
    }
    context.login(username, password).then((loggedIn) => {
      if (!loggedIn) {
        setError("Invalid Credentials");
      }
    });
  };

  return !context.user ? (
    <>
      <div className="hero is-primary ">
        <div className="hero-body container">
          <h4 className="title">Login</h4>
        </div>
      </div>
      <br />
      <br />
      <form onSubmit={login}>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <div className="field">
              <label className="label">Email: </label>
              <input
                className="input"
                type="email"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Password: </label>
              <input
                className="input"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </div>
            {error && <div className="has-text-danger">{error}</div>}
            <div className="field is-clearfix">
              <button className="button is-primary is-outlined is-pulled-right">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  ) : (
    <Redirect to="/products" />
  );
};

export default withContext(Login);
