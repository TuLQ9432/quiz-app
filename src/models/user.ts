import { PaginatedListOutput } from "./list";

interface User {
  score: number;
  role: string;
  isEmailVerified: boolean;
  avatar: string;
  username: string;
  email: string;
  password: string;
  id: string;
}

export type AuthInput = Pick<User, "username" | "email" | "password">;

export type UserOutput = Omit<User, "password">;

export type UserListOutput = PaginatedListOutput<UserOutput>;

export type UserId = User["id"];

export type NewUserInput = Pick<
  User,
  "username" | "email" | "password" | "role"
>;

export type EditUserInput = Partial<
  Omit<User, "id" | "isEmailVerified" | "password" | "score">
>;
