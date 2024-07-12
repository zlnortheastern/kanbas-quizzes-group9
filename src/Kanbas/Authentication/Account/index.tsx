import React, { useEffect, useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import { useAuth } from "../AuthProvider";
import * as client from "../client";
import { GrEdit } from "react-icons/gr";
export default function Account() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    role: "",
    image: "",
  });
  const auth = useAuth();

  const fetchUser = async () => {
    const data = await client.getUser(auth.token);
    setUser({ ...user, ...data[0] });
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <h2>
        <FaAlignJustify className="me-4 fs- mb-1 text-danger" />
        {user.firstName} {user.lastName}'s profile
      </h2>
      <hr />
      <div className="row">
        <div className="col-3">
          <div>
            <img
              style={{ height: "120px", width: "120px" }}
              className="border border-secondary rounded-circle"
              src={user.image ? user.image : "/images/avatar-50.png"}
              alt="user-profile-image"
            />
          </div>
          <div>
            <button className="btn btn-secondary m-3" onClick={auth.logout}>Log out</button>
          </div>
        </div>
        <div className="col-6">
          <h3>
            {user.firstName} {user.lastName}{" "}
          </h3>
        </div>
        <div className="col-3">
          <button className="btn btn-secondary float-end">
            <GrEdit />Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
