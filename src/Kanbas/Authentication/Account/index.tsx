import React, { useEffect, useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import { useAuth } from "../AuthProvider";
import * as client from "../client";
import { GrEdit } from "react-icons/gr";
export default function Account() {
  const [user, setUser] = useState<any>();

  const [updateUser, setUpdateUser] = useState<any>();
  const [editing, setEditing] = useState(false);

  const auth = useAuth();

  const fetchUser = async () => {
    const data = await client.getUser(auth.token);
    setUpdateUser(data);
    setUser(data);
  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setUpdateUser((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const putUser = async (updatedUser: any) => {
    await client.updateUser(updatedUser);
  };
  const handleSubmitEvent = (e: any) => {
    e.preventDefault();
    putUser(updateUser);
    setUser({ ...user, ...updateUser });
    setEditing(false);
  };
  const handleCancleUpdate = () => {
    setEditing(false);
    setUpdateUser({ ...updateUser, ...user });
  };
  useEffect(() => {
    fetchUser();
  }, []);

  if (!user && !updateUser) return <></>;
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
            {!editing && (
              <button className="btn btn-secondary m-3" onClick={auth.logout}>
                Log out
              </button>
            )}
          </div>
        </div>
        {editing ? (
          <form className="col-6" onSubmit={handleSubmitEvent}>
            <label htmlFor="first-name">First name</label>
            <input
              type="text"
              className="form-control mb-2"
              id="first-name"
              name="firstName"
              value={updateUser.firstName}
              onChange={handleInput}
            />
            <label htmlFor="last-name">Last name</label>
            <input
              type="text"
              className="form-control mb-5"
              id="last-name"
              name="lastName"
              value={updateUser.lastName}
              onChange={handleInput}
            />
            {/* Set role editable for easily testing */}
            <label htmlFor="user-role">Role</label>
            <select
              className="form-select mb-5"
              id="user-role"
              name="role"
              value={updateUser.role}
              onChange={handleInput}
            >
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
            </select>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control mb-5"
              id="user-email"
              name="email"
              value={updateUser.email}
              onChange={handleInput}
            />
            <label htmlFor="birthday">Birthday</label>
            <input
              type="date"
              className="form-control mb-5"
              id="user-email"
              name="dob"
              value={updateUser.dob}
              onChange={handleInput}
            />
            <button className="float-end btn btn-danger btn-submit">
              Save Profile
            </button>
            <button
              className="float-end btn btn-secondary me-2"
              onClick={handleCancleUpdate}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="col-6">
            <h3 className="mb-5">
              {user.firstName} {user.lastName} (
              {user.role === "FACULTY" ? "Faculty" : "Student"})
            </h3>
            <h3>Contact</h3>
            <p className="fs-5 ms-1 mb-5">Email: {user.email}</p>
            <h3>Birthday</h3>
            <p className="fs-5 ms-1 mb-5">{user.dob}</p>
          </div>
        )}

        <div className="col-3">
          {editing ? (
            <button
              className="btn btn-secondary float-end"
              onClick={handleCancleUpdate}
            >
              <GrEdit />
              Cancel Profile
            </button>
          ) : (
            <button
              className="btn btn-secondary float-end"
              onClick={() => setEditing(true)}
            >
              <GrEdit />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
