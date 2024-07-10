import GradesControls from "./GradesControls";
import * as db from "../../Database";
import { useParams } from "react-router";
export default function Grades() {
  const { cid } = useParams();
  const currentEnrollments = db.enrollments.filter(e => e.course === cid);
  const students = currentEnrollments.map(e => db.users.find(u => u._id === e.user));
  const assignments = db.assignments.filter(a => a.course === cid);
  const grades = db.grades.filter(g => currentEnrollments.some(e => e.user === g.student));
  const getGrade = (studentId: string, assignmentId: string) => {
    const grade = grades.find(g => g.student === studentId && g.assignment === assignmentId);
    return grade ? grade.grade : "N/A";
  };
  return (
    <div id="wd-grades">
      <GradesControls />
      <div>
        <div className="table-responsive">
          <table id="wd-grade-table" className="table table-striped table-bordered align-middle fs-5 text-nowrap">
            <tbody className="text-center">
              <tr>
                <td className="text-start">Student Name</td>
                {assignments.map(assignment => (
                  <td>
                    {assignment.title}
                    <div className="fs-6">Out of {assignment.points}</div>
                  </td>
                ))}
              </tr>
              {students.map(student => (
                <tr>
                  <td className="text-danger text-start">{student?.firstName} {student?.lastName}</td>
                  {assignments.map(assignment => (
                    <td>{student ? getGrade(student._id, assignment._id) : "N/A"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
}