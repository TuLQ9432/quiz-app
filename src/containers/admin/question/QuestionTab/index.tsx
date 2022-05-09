import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { QuestionOutputContext } from "../context";
import { AdminQuestionOutput } from "../../../../models/question";
import QuestionList from "../QuestionList";
import QuestionDetail from "../QuestionDetail";

export default function QuestionTab() {
  const [question, setQuestion] = useState<AdminQuestionOutput>();

  return (
    <QuestionOutputContext.Provider value={{ question, setQuestion }}>
      <Routes>
        <Route index element={<QuestionList />} />
        <Route path="edit/:id" element={<QuestionDetail />} />
        <Route path="new" element={<QuestionDetail />} />
      </Routes>
    </QuestionOutputContext.Provider>
  );
}
