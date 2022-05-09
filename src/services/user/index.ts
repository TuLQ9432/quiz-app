import rootApi from "../root-api";
import {
  UserId,
  UserOutput,
  UserListOutput,
  NewUserInput,
  EditUserInput,
} from "../../models/user";

namespace userApi {
  const parentUrl = "/users/";

  export function getList(page: number /*, limit: number */) {
    return rootApi.get<UserListOutput, UserListOutput>(parentUrl, {
      params: {
        page: page,
        // limit: limit
      },
    });
  }

  export function get(userId: UserId) {
    return rootApi.get<UserOutput, UserOutput>(parentUrl + userId);
  }

  export function create(data: NewUserInput) {
    return rootApi.post<UserOutput, UserOutput, NewUserInput>(parentUrl, data);
  }

  export function update(userId: UserId, data: EditUserInput) {
    return rootApi.patch<UserOutput, UserOutput, EditUserInput>(
      parentUrl + userId,
      data
    );
  }
}

export default userApi;
