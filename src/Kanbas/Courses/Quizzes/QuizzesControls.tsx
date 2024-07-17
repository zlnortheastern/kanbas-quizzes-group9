import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router-dom";
export default function QuizzesControls() {
  return (
    <div id="wd-quizzes-controls" className="text-nowrap">  
      <IoEllipsisVertical className="fs-4 float-end mt-1 btn-danger" />
      <Link to="new" id="wd-add-quizzes-btn" className="btn btn-lg btn-danger me-1 float-end">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Quiz
      </Link>
      <div className="search-bar d-flex align-items-center p-1 border rounded p-0 bg-white float-start">
        <input type="text" className="form-control border-0" placeholder="Search for Quiz" width="20rem" />
      </div>
      <hr />
    </div>
    
  );
}
