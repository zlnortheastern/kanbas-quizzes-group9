import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });
  const handleSubmitEvent = (e: any) => {
    e.preventDefault();
    console.log(e.target.elements.username.value);
  };
  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
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
              htmlFor="kanbas-login-username"
            >
              Kanbas Username
            </label>
            <input name="username" id="kanbas-login-username" className="form-control p-3" onChange={handleInput}/>
          </div>
          <div className="form-group text-start mb-4">
            <label
              className="form-label fw-bold"
              htmlFor="kanbas-login-password"
            >
              Kanbas Password
            </label>
            <input name="password" id="kanbas-login-password" className="form-control p-3" onChange={handleInput}/>
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
            &gt; No account? <Link to="/Kanbas/Signup">Sign up</Link> here.
          </div>
        </form>
      </div>
    </div>
  );
}
