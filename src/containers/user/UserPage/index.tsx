import { useAppSelector } from "../../../hooks";
import QuestionPage from "../QuestionPage";
import ResultPage from "../ResultPage";

export default function UserPage() {
  const resultList = useAppSelector((state) => state.userQuiz.resultList);
  if (resultList.length === 0) return <QuestionPage />;
  return <ResultPage />;
}
