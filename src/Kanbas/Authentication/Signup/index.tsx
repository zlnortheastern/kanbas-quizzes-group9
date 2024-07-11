import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    _password: "",
    role: "STUDENT",
  });
  const handleSubmitEvent = (e: any) => {
    e.preventDefault();
    console.log(e.target.elements.username.value);
  };
  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="row" style={{ padding: "80px" }}>
      <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
        <img
          className="mb-4"
          src="/images/northeastern-logo.svg"
          style={{ width: "320px" }}
          alt=""
        />
        <form
          onSubmit={handleSubmitEvent}
          style={{ width: "100%", maxWidth: "250px", margin: "auto" }}
          className="mb-4"
        >
          <div className="form-group text-start mb-4">
            <label
              className="form-label fw-bold"
              htmlFor="kanbas-signup-username"
            >
              Enter a username
            </label>
            <input
            name="username"
              id="kanbas-signup-username"
              className="form-control p-3"
              onChange={handleInput}
            />
          </div>
          <div className="form-group text-start mb-4">
            <label
              className="form-label fw-bold"
              htmlFor="kanbas-signup-password"
            >
              Enter a password
            </label>
            <input
            name="password"
              id="kanbas-signup-password"
              className="form-control p-3"
              onChange={handleInput}
            />
          </div>
          <div className="form-group text-start mb-4">
            <label
              className="form-label fw-bold"
              htmlFor="kanbas-signup-reenter"
            >
              Re-enter the password
            </label>
            <input
            name="_password"
              id="kanbas-signup-reenter"
              className="form-control p-3"
              onChange={handleInput}
            />
          </div>
          <div className="form-group text-start mb-4">
            <label
              className="form-label fw-bold"
              htmlFor="kanbas-signup-reenter"
            >
              Choose a role
            </label>
            <select
              className="form-select form-select-lg"
              name="role"
              id="kanbas-signup-role"
              onChange={handleInput}
            >
              <option value="STUDENT" selected>
                Student
              </option>
              <option value="FACULTY">FACULTY</option>
            </select>
          </div>
          <div className="form-group mb-4">
            <button
              className="btn btn-lg btn-danger btn-submit"
              style={{ width: "100%" }}
            >
              Log In
            </button>
          </div>
          <div className="text-secondary">
            &gt; Have an account? <Link to="/Kanbas/Login">Log in</Link> here.
          </div>
        </form>
      </div>
    </div>
  );
}
