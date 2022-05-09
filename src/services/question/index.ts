import rootApi from "../root-api";
import {
  UserQuestionListOutput,
  UserAnswerList,
  UserResultList,
  AdminQuestionListOutput,
  QuestionId,
  AdminQuestionOutput,
  AdminQuestionInput,
} from "../../models/question";

namespace questionApi {
  const parentUrl = "/questions/";

  export function getQuestionList(page: number /*, limit: number */) {
    return rootApi.get<UserQuestionListOutput, UserQuestionListOutput>(
      parentUrl,
      {
        params: {
          page: page,
          // limit: limit
        },
      }
    );
  }

  export function submitAnswerList(answers: UserAnswerList) {
    return rootApi.post<UserResultList, UserResultList, UserAnswerList>(
      parentUrl + "submit",
      answers
    );
  }

  export function getEditQuestionList(page: number /*, limit: number */) {
    return rootApi.get<AdminQuestionListOutput, AdminQuestionListOutput>(
      parentUrl + "edit",
      {
        params: {
          page: page,
          // limit: limit
        },
      }
    );
  }

  export function createQuestion(question: AdminQuestionInput) {
    return rootApi.post<
      AdminQuestionOutput,
      AdminQuestionOutput,
      AdminQuestionInput
    >(parentUrl + "edit", question);
  }

  export function getEditQuestion(questionId: QuestionId) {
    return rootApi.get<AdminQuestionOutput, AdminQuestionOutput>(
      parentUrl + "edit/" + questionId
    );
  }

  export function updateQuestion(
    questionId: QuestionId,
    data: AdminQuestionInput
  ) {
    return rootApi.patch<
      AdminQuestionOutput,
      AdminQuestionOutput,
      AdminQuestionInput
    >(parentUrl + "edit/" + questionId, data);
  }

  export function deleteQuestion(questionId: QuestionId) {
    return rootApi.delete<never>(parentUrl + "edit/" + questionId);
  }
}

export default questionApi;
