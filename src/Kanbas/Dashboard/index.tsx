import { Link } from "react-router-dom";
import * as db from "../Database";
import { useEffect, useState } from "react";
import { useAuth, useUserRole } from "../Authentication/AuthProvider";
import * as client from "./client";
import { Course } from "..";
export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
}: {
  courses: Course[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: (userId: string) => void;
  deleteCourse: (course: any) => void;
  updateCourse: () => void;
}) {
  const auth = useAuth();
  const role = useUserRole();
  const [enrollments, setEnrollments] = useState([] as string[]);
  const fetchEnrollments = async (userId: string) => {
    const data = await client.getEnrollments(userId);
    setEnrollments(data);
  };

  useEffect(() => {
    fetchEnrollments(auth.token);
  }, [courses]);

  if (!role) return <></>;
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      {role === "FACULTY" ? (
        <div>
          <hr />
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => addNewCourse(auth.token)}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <input
            value={course.name}
            className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <textarea
            value={course.description}
            className="form-control"
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
          <h2 id="wd-dashboard-published">
            Published Courses ({enrollments.length})
          </h2>
        </div>
      ) : (
        <div>
          <hr />
          <h3>
            Enrolled Courses ({enrollments.length})
            <Link
              to={`/Kanbas/Registration`}
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
            >
              Enroll new course
            </Link>
          </h3>
        </div>
      )}
      <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses
            .filter((c) => enrollments.includes(c._id))
            .map((course) => (
              <div
                key={course._id}
                className="wd-dashboard-course col"
                style={{ width: "300px" }}
              >
                <Link
                  to={`/Kanbas/Courses/${course._id}/Home`}
                  className="text-decoration-none"
                >
                  <div className="card rounded-3 overflow-hidden">
                    <img
                      src={course.image ? course.image : `/images/react.webp`}
                      style={{
                        height: "160px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <div className="card-body">
                      <span
                        className="wd-dashboard-course-link"
                        style={{
                          textDecoration: "none",
                          color: "navy",
                          fontWeight: "bold",
                        }}
                      >
                        {course.name}
                      </span>
                      <p
                        className="wd-dashboard-course-title card-text"
                        style={{ maxHeight: 53, overflow: "hidden" }}
                      >
                        {course.description}
                      </p>
                      {/* <Link
                        to={`/Kanbas/Courses/${course._id}/Home`}
                        className="btn btn-primary"
                      >
                        Go
                      </Link> */}
                      {role === "FACULTY" && (
                        <div>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              deleteCourse(course._id);
                            }}
                            className="btn btn-danger float-end"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </button>
                          <button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(course);
                            }}
                            className="btn btn-warning me-2 float-end"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
