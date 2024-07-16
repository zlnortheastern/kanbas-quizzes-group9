import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Authentication/AuthProvider";
import * as client from "../client";

export default function Registration() {
  const [courses, setCourses] = useState([] as any[]);
  const user = useAuth();
  const fetchEnrollableCourses = async (userId: string) => {
    const data = await client.getEnrollables(userId);
    console.log(data);
    setCourses(data);
  };
  const enrollACourse = async (courseId: string) => {
    const enroll = await client.enrollCourse(user.token, courseId);
    if (enroll)
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
  };
  useEffect(() => {
    fetchEnrollableCourses(user.token);
  }, []);
  return (
    <div id="wd-registarion">
      <h1 id="wd-registarion-title">Registration</h1>
      <hr />
      <Link to={`/Kanbas/Dashboard`} className="btn btn-primary">
        &lt; Dashboard
      </Link>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Number</th>
            <th scope="col">Credits</th>
            <th scope="col">Department</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr>
              <td>{course.name}</td>
              <td>{course.number}</td>
              <td>{course.credits}</td>
              <td>{course.department}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => enrollACourse(course._id)}
                >
                  Enroll
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
