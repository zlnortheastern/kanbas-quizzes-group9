import "./index.css";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
export default function CoursesNavigation({ courses }: { courses: any }) {
  const { cid } = useParams();
  const course = courses.find((course:any) => course._id === cid);
  const { pathname } = useLocation();
  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People"
  ];
  return (
    <div id="wd-courses-navigation" className="list-group fs-5 rounded-0">
      {links.map((link, i) => (
        <Link
          key={i}
          to={`/Kanbas/Courses/${course && course._id}/${link}`}
          className={`list-group-item border border-0 ${
            pathname.includes(link) ? "active" : "text-danger"
          }`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}
