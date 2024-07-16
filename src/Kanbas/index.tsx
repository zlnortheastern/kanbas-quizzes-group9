import KanbasNavigation from "./Navigation";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import { useEffect, useState } from "react";
import store from "./store";
import { Provider } from "react-redux";
import * as client from "./Courses/client";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import { AuthProvider, useAuth } from "./Authentication/AuthProvider";
import Account from "./Authentication/Account";

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
  image: string;
}
export default function Kanbas() {
  const [courses, setCourses] = useState<Course[]>([]);
  const fetchCourses = async () => {
    const courses = await client.fetchAllCourses();
    setCourses(courses);
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  const [course, setCourse] = useState<any>({
    _id: "1234",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
  });
  const addNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    setCourses([...courses, newCourse]);
  };
  const deleteCourse = async (courseId: any) => {
    await client.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId));
  };
  const updateCourse = async () => {
    await client.updateCourse(course);
    setCourses(
      courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    );
  };
  return (
    <AuthProvider>
      <Provider store={store}>
        <div id="wd-kanbas" className="h-100">
          <div className="d-flex h-100">
            <KanbasNavigation />
            <div className="flex-fill p-4" style={{ marginLeft: "120px" }}>
              <Routes>
                <Route element={<RedirectLogOut />}>
                  <Route path="/" element={<Navigate to="Dashboard" />} />
                  <Route path="Account" element={<Account />} />
                  <Route
                    path="Dashboard"
                    element={
                      <Dashboard
                        courses={courses}
                        course={course}
                        setCourse={setCourse}
                        addNewCourse={addNewCourse}
                        deleteCourse={deleteCourse}
                        updateCourse={updateCourse}
                      />
                    }
                  />
                  <Route
                    path="Courses/:cid/*"
                    element={<Courses courses={courses} />}
                  />
                </Route>
                <Route element={<RedirectLogIn />}>
                  <Route path="Login" element={<Login />} />
                  <Route path="Signup" element={<Signup />} />
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </Provider>
    </AuthProvider>
  );
}
const RedirectLogOut = () => {
  const user = useAuth();
  if (!user.token) return <Navigate to="Login" />;
  return <Outlet />;
};
const RedirectLogIn = () => {
  const user = useAuth();
  if (user.token) return <Navigate to="Dashboard" />;
  return <Outlet />;
};
