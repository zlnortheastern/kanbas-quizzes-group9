import { IoMdSettings } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { LiaFileExportSolid } from "react-icons/lia";
import { LiaFileImportSolid } from "react-icons/lia";
import { CiFilter } from "react-icons/ci";
export default function GradesControls() {
  return (
    <div id="wd-grades-controls" className="text-nowrap">
      <button id="wd-grades-setting" className="btn btn-lg btn-secondary float-end">
        <IoMdSettings className="fs-2" />
      </button>
      <div className="dropdown d-inline float-end">
        <button id="wd-grades-setting" className="btn btn-lg btn-secondary me-3 float-end dropdown-toggle" data-bs-toggle="dropdown">
          <LiaFileExportSolid className="fs-2 me-2" />
          Export
        </button>
        <ul className="dropdown-menu">
          <li>
            <a id="wd-grades-setting" className="dropdown-item">
              <LiaFileExportSolid className="fs-2 me-2" />
              Export
            </a>
          </li>
        </ul>
      </div>
      <button id="wd-grades-setting" className="btn btn-lg btn-secondary me-3 float-end">
        <LiaFileImportSolid className="fs-2 me-2" />
        Import
      </button>

      <br /><br /><br />

      <div id="wd-grades-name-search" className="mb-3 row">
        <div className="col-sm-6">
          <label htmlFor="wd-grades-student-name" className="form-label fw-bold fs-5">Student Names</label>
          <div className="search-bar d-flex align-items-center p-1 border rounded p-0 bg-white">
            <IoSearchOutline className="fs-3 mx-2" />
            <input type="text" id="wd-grades-student-name" className="form-select border-0 fs-5" placeholder="Search Students" />
          </div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="wd-grades-assignment-name" className="form-label fw-bold fs-5">Assignment Names</label>
          <div className="search-bar d-flex align-items-center p-1 border rounded p-0 bg-white">
            <IoSearchOutline className="fs-3 mx-2" />
            <input type="text" id="wd-grades-assignment-name" className="form-select border-0 fs-5" placeholder="Search Assignments" />
          </div>
        </div>
      </div>

      <button id="wd-grades-setting" className="btn btn-lg btn-secondary my-2">
        <CiFilter className="fs-2" />
        Apply Filters
      </button>
    </div>
  );
}