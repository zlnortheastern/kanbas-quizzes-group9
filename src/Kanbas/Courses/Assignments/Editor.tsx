import { useParams } from "react-router";
import * as db from "../../Database";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addAssignment, updateAssignment } from "./reducer";
import * as client from "./client";
export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const [assignment, setAssignment] = useState<any>(
    assignments.find((a: any) => a._id === aid) || {
      title: "New Assignment",
      course: cid,
      description: "Assignment Description",
      points: 100,
      assignmentGroup: "ASSIGNMENTS",
      displayGradeAs: "Percentage",
      submissionType: "Online",
      assign: {
        assignTo: "Everyone",
        due: "",
        availableFrom: "",
        until: "",
      },
    }
  );
  const dispatch = useDispatch();

  const createAssignment = async (assignment: any) => {
    const newAssignment = await client.createAssignment(cid as string, assignment);
    dispatch(addAssignment(newAssignment));
  };
  const saveAssignment = async (assignment: any) => {
    const status = await client.updateAssignment(assignment);
    dispatch(updateAssignment(assignment));
  };

  return (
    <div id="wd-assignments-editor">
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <input
          type="text"
          className="form-control"
          id="wd-name"
          value={assignment.title}
          onChange={(e) => {
            setAssignment({ ...assignment, title: e.target.value });
          }}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          id="wd-description"
          rows={5}
          onChange={(e) => {
            setAssignment({ ...assignment, description: e.target.value });
          }}
        >
          {assignment.description}
        </textarea>
      </div>

      <div className="mb-3 row">
        <label htmlFor="wd-points" className="col-sm-2 col-form-label text-end">
          Points
        </label>
        <div className="col-sm-10">
          <input
            type="number"
            className="form-control"
            id="wd-points"
            value={assignment && assignment.points}
            onChange={(e) => {
              setAssignment({ ...assignment, points: e.target.value });
            }}
          />
        </div>
      </div>

      <div className="mb-3 row">
        <label htmlFor="wd-group" className="col-sm-2 col-form-label text-end">
          Assignment Group
        </label>
        <div className="col-sm-10">
          <select id="wd-group" className="form-select">
            <option selected value="ASSIGNMENTS">
              ASSIGNMENTS
            </option>
          </select>
        </div>
      </div>

      <div className="mb-3 row">
        <label
          htmlFor="wd-display-grade-as"
          className="col-sm-2 col-form-label text-end"
        >
          Display Grade as
        </label>
        <div className="col-sm-10">
          <select id="wd-display-grade-as" className="form-select">
            <option selected value="Percentage">
              Percentage
            </option>
          </select>
        </div>
      </div>

      <div className="mb-3 row">
        <label
          htmlFor="wd-submission-type"
          className="col-sm-2 col-form-label text-end"
        >
          Submission Type
        </label>
        <div className="col-sm-10">
          <div className="border rounded-2 p-3">
            <select id="wd-submission-type" className="form-select">
              <option selected value="Online">
                Online
              </option>
            </select>
            <p className="mt-3 fw-bold">Online Entry Options</p>
            <div className="form-check my-2">
              <input
                type="checkbox"
                className="form-check-input"
                name="check-genre"
                id="wd-text-entry"
              />
              <label htmlFor="wd-text-entry">Text Entry</label>
            </div>
            <div className="form-check my-2">
              <input
                type="checkbox"
                className="form-check-input"
                name="check-genre"
                id="wd-website-url"
              />
              <label htmlFor="wd-website-url">Website URL</label>
            </div>
            <div className="form-check my-2">
              <input
                type="checkbox"
                className="form-check-input"
                name="check-genre"
                id="wd-media-recordings"
              />
              <label htmlFor="wd-media-recordings">Media Recordings</label>
            </div>
            <div className="form-check my-2">
              <input
                type="checkbox"
                className="form-check-input"
                name="check-genre"
                id="wd-student-annotation"
              />
              <label htmlFor="wd-student-annotation">Student Annotation</label>
            </div>
            <div className="form-check my-2">
              <input
                type="checkbox"
                className="form-check-input"
                name="check-genre"
                id="wd-file-upload"
              />
              <label htmlFor="wd-file-upload" className="">
                File Uploads
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 row">
        <p className="col-sm-2 col-form-label text-end">Assign</p>
        <div className="col-sm-10">
          <div className="border rounded-2 p-3">
            <label htmlFor="wd-assign-to" className="fw-bold">
              Assign to
            </label>
            <input
              id="wd-assign-to"
              className="form-control"
              value={assignment ? assignment.assign.assignTo : "Everyone"}
              onChange={(e) => {
                setAssignment({
                  ...assignment,
                  assign: { ...assignment.assign, assignTo: e.target.value },
                });
              }}
            />
            <div className="my-3">
              <label htmlFor="wd-due-date" className="form-label fw-bold">
                Due
              </label>
              <input
                type="datetime-local"
                id="wd-due-date"
                className="form-control"
                value={assignment && assignment.assign.due}
                onChange={(e) => {
                  setAssignment({
                    ...assignment,
                    assign: { ...assignment.assign, due: e.target.value },
                  });
                }}
              />
            </div>
            <div className="row my-2 my-3">
              <div className="col-sm-6">
                <label
                  htmlFor="wd-available-from"
                  className="form-label fw-bold"
                >
                  Available from
                </label>
                <input
                  type="datetime-local"
                  id="wd-available-from"
                  className="form-control"
                  value={assignment && assignment.assign.availableFrom}
                  onChange={(e) => {
                    setAssignment({
                      ...assignment,
                      assign: {
                        ...assignment.assign,
                        availableFrom: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="col-sm-6">
                <label
                  htmlFor="wd-available-until"
                  className="form-label fw-bold"
                >
                  Until
                </label>
                <input
                  type="datetime-local"
                  id="wd-available-until"
                  className="form-control"
                  value={assignment && assignment.assign.until}
                  onChange={(e) => {
                    setAssignment({
                      ...assignment,
                      assign: { ...assignment.assign, until: e.target.value },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div id="wd-assignments-controls" className="text-nowrap">
        <Link
          to={`/Kanbas/Courses/${cid}/Assignments`}
          id="wd-assignments-editor-save"
          className="btn btn-lg btn-danger me-1 float-end"
          onClick={() =>
            aid === "new"
              ? createAssignment({ ...assignment, course: cid })
              : saveAssignment(assignment)
          }
        >
          Save
        </Link>
        <Link
          to={`/Kanbas/Courses/${cid}/Assignments`}
          id="wd-assignments-editor-cancel"
          className="btn btn-lg btn-secondary me-1 float-end"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
