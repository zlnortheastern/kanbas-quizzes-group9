import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { MdDoNotDisturb } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
export default function AssignmentsControls() {
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <Link to="new" id="wd-add-module-btn" className="btn btn-lg btn-danger me-1 float-end">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </Link>
      <button id="wd-add-module-btn" className="btn btn-lg btn-secondary me-1 float-end">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </button>
      <div className="search-bar d-flex align-items-center p-1 border rounded p-0 bg-white float-start">
        <IoSearchOutline className="fs-3 mx-2"/>
        <input type="text" className="form-control border-0" placeholder="Search..." width="16rem" />
      </div>
    </div>
  );
}
