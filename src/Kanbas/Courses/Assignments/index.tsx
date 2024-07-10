import AssignmentsControls from "./AssignmentsControls";
import { BsGripVertical, BsPlusLg } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { PiNotepadThin } from "react-icons/pi";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { deleteAssignment, setAssignments } from "./reducer";
import * as client from "./client";
import { useEffect } from "react";
export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();
  const fetchAssignments = async () => {
    const assignments = await client.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  };
  const removeAssignment = async (assignmentId: string) => {
    await client.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return `${month} ${day} at ${hours}:${minutesStr}${ampm}`;
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  return (
    <div id="wd-assignments">
      <AssignmentsControls />
      <br />
      <br />
      <br />
      <br />
      <li className="wd-assignments list-group-item p-0 mb-5 fs-5 border-gray">
        <div className="wd-assignments-title p-3 ps-2 bg-secondary">
          <BsGripVertical className="me-2 fs-3" />
          <IoMdArrowDropdown className="me-2" />
          <span className="fw-bold">ASSIGNMENTS</span>
          <IoEllipsisVertical className="fs-4 float-end mt-1" />
          <BsPlusLg className="float-end fs-4 me-3 mt-1 ms-1" />
          <div className="border float-end rounded-5 border-dark px-2">
            40% of Total{" "}
          </div>
        </div>
        <ul
          id="wd-assignment-list"
          className="wd-assignment-list list-group rounded-0"
        >
          {assignments
            .filter((a: any) => a.course === cid)
            .map((a: any) => (
              <li className="wd-assignment-item list-group-item d-flex align-items-center p-3 ps-1">
                <BsGripVertical className="me-2 fs-3 " />
                <PiNotepadThin className="me-4 fs-3 text-success" />
                <div>
                  <Link
                    to={`/Kanbas/Courses/${cid}/Assignments/${a._id}`}
                    className="wd-assignment-link fs-5 fw-bold text-decoration-none text-dark"
                  >
                    {a.title}
                  </Link>
                  <p className="mb-0 text-muted">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <b>Not available until</b>{" "}
                    {formatDate(a.assign.availableFrom)} | <b>Due</b>{" "}
                    {formatDate(a.assign.due)} | {a.points}
                  </p>
                </div>
                <div className="ms-auto">
                  <FaTrash
                    className="text-danger me-2 mb-1"
                    onClick={() => removeAssignment(a._id)}
                  />
                  <GreenCheckmark />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </li>
            ))}
        </ul>
      </li>
    </div>
  );
}
