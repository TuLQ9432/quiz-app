import { createContext, Dispatch, SetStateAction } from "react";
import { UserOutput } from "../../../models/user";

type UserOutputOptional = UserOutput | undefined;

export const UserOutputContext = createContext<{
  user: UserOutputOptional;
  setUser: Dispatch<SetStateAction<UserOutputOptional>>;
}>({
  user: undefined,
  setUser: () => {},
});
