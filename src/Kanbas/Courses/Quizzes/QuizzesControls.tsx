import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";

export default function QuizzesControls() {
  const { cid } = useParams();
  return (
    <div id="wd-quizzes-controls" className="text-nowrap mt-3">
      <div className="row align-items-center w-100">
        <div className="col-md-8">
          <div className="input-group" style={{ height: "40px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for Quiz"
            />
          </div>
        </div>
        <div className="col-md-4 text-end d-flex justify-content-end align-items-center">
          <Link
            to={`/Kanbas/Courses/${cid}/Quizzes/new/edit`}
            id="wd-add-quizzes-btn"
            className="btn btn-lg btn-danger me-2 d-flex align-items-center"
            style={{ height: "40px" }}
          >
            <FaPlus className="me-2" style={{ bottom: "1px" }} />
            Quiz
          </Link>
          <button
            className="btn btn-light border d-flex align-items-center"
            style={{ height: "40px", padding: "0 10px" }}
          >
            <IoEllipsisVertical className="fs-4" />
          </button>
        </div>
      </div>
      <hr />
    </div>
  );
}
