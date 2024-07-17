import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "../client";
export default function Signup() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    role: "STUDENT",
  });
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const navigate = useNavigate();
  const createUser = async (newUser: any) => {
    try {
      const user = await client.createUser(newUser);
      navigate("/Kanbas/Login");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };
  const checkEmpty = (user: any) => {
    const errors = [];
    for (const key in user) {
      if (user[key] === "") {
        errors.push(<li>{key} is required</li>);
      }
    }
    console.log(errors);
    if (errors.length > 0) {
      setErrorMessage(errors);
      return false;
    }
    return true;
  };
  const handleSubmitEvent = (e: any) => {
    e.preventDefault();
    if (checkEmpty(user)) {
      createUser(user);
    }
  };
  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div style={{ padding: "30px", marginLeft: "-120px" }}>
      {errorMessage && (
        <div
          id="wd-todo-error-messag"
          className="text-center alert alert-danger m-3 p-2"
        >
          {errorMessage}
        </div>
      )}
      <div className="text-center col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
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
              className="form-control p-2"
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
              type="password"
              name="password"
              id="kanbas-signup-password"
              className="form-control p-2"
              onChange={handleInput}
            />
          </div>
          <div className="form-group text-start mb-4 row">
            <div className="col-6">
              <label
                className="form-label fw-bold"
                htmlFor="kanbas-signup-reenter"
              >
                First Name
              </label>
              <input
                name="firstName"
                id="kanbas-signup-first-name"
                className="form-control p-2"
                onChange={handleInput}
              />
            </div>
            <div className="col-6">
              <label
                className="form-label fw-bold"
                htmlFor="kanbas-signup-reenter"
              >
                Last Name
              </label>
              <input
                name="lastName"
                id="kanbas-signup-last-name"
                className="form-control p-2"
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-group text-start mb-4">
            <label className="form-label fw-bold" htmlFor="kanbas-signup-email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="kanbas-signup-email"
              className="form-control p-2"
              onChange={handleInput}
            />
          </div>
          <div className="form-group text-start mb-4">
            <label className="form-label fw-bold" htmlFor="kanbas-signup-email">
              Birthday
            </label>
            <input
              type="date"
              name="dob"
              id="kanbas-signup-email"
              className="form-control p-2"
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
              className="form-select p-2"
              name="role"
              id="kanbas-signup-role"
              onChange={handleInput}
            >
              <option value="STUDENT" selected>
                Student
              </option>
              <option value="FACULTY">Faculty</option>
            </select>
          </div>
          <div className="form-group mb-4">
            <button
              className="btn btn-lg btn-danger btn-submit"
              style={{ width: "100%" }}
            >
              Sign up
            </button>
          </div>
          <div className="text-secondary text-start">
            &gt; Have an account? <Link to="/Kanbas/Login">Log in</Link> here.
          </div>
        </form>
      </div>
    </div>
  );
}
