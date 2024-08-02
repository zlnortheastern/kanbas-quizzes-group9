import { courses } from "../Database";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import Grades from "./Grades";
import Quizzes from "./Quizzes";
import QuizDetails from "./Quizzes/QuizDetails";
import EditDetails from "./Quizzes/Editor/editDetails";
import EditQuestions from "./Quizzes/Editor/editQuestions";
import PeopleTable from "./People/Table";
import { useUserRole } from "../Authentication/AuthProvider";
import QuizStudent from "./Quizzes/StudentView";
export default function Courses({ courses }: { courses: any[] }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  const role = useUserRole();
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}{" "}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation courses={courses} />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="Grades" element={<Grades />} />
            <Route path="Quizzes" element={<Quizzes role={role} />} />
            <Route
              path="Quizzes/:qid"
              element={role === "FACULTY" ? <QuizDetails /> : <QuizStudent />}
            />
            <Route path="Quizzes/:qid/edit" element={<EditDetails />} />
            <Route path="Quizzes/:qid/questions" element={<EditQuestions />} />
            <Route path="People" element={<PeopleTable />} />
            <Route path="People/:uid" element={<PeopleTable />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
