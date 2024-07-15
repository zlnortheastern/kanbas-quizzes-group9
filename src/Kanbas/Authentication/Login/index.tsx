import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "../client";
import { useAuth } from "../AuthProvider";

export default function Login() {
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const navigate = useNavigate();

  const auth = useAuth();
  const getUser = async (input: any) => {
    try {
      await auth.login(input);
      navigate("/Kanbas/Dashboard");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };
  const handleSubmitEvent = (e: any) => {
    e.preventDefault();
    getUser(userInput);
  };
  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div style={{ padding: "30px", marginLeft:"-120px"}}>
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
              htmlFor="kanbas-login-username"
            >
              Kanbas Username
            </label>
            <input
              name="username"
              id="kanbas-login-username"
              className="form-control p-3"
              onChange={handleInput}
            />
          </div>
          <div className="form-group text-start mb-4">
            <label
              className="form-label fw-bold"
              htmlFor="kanbas-login-password"
            >
              Kanbas Password
            </label>
            <input
              type="password"
              name="password"
              id="kanbas-login-password"
              className="form-control p-3"
              onChange={handleInput}
            />
          </div>
          <div className="form-group mb-4">
            <button
              className="btn btn-lg btn-danger btn-submit"
              style={{ width: "100%" }}
            >
              Log In
            </button>
          </div>
          <div className="text-secondary text-start">
            &gt; No account? <Link to="/Kanbas/Signup">Sign up</Link> here.
          </div>
        </form>
      </div>
    </div>
  );
}
