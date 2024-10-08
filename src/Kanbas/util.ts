import { Answers, Question, Questions } from "./Courses/Quizzes/interface";
export const MAX_DATE_TIME = 8640000000000000;
export const MIN_DATE_TIME = -8640000000000000;
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
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

export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
};

export const getHighestScore = (answers: Answers[]) => {
  let result = 0;
  answers.forEach((answer) => {
    if (answer.score > result) result = answer.score;
  });
  return result;
};

export const calculateQuizPoints = (questionSet: Questions) => {
  let points = 0;
  questionSet.questions.forEach((q) => {
    points += q.points;
  });
  return points;
};
