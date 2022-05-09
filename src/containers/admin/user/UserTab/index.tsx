import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { UserOutputContext } from "../context";
import { UserOutput } from "../../../../models/user";
import UserList from "../UserList";
import UserDetail from "../UserDetail";
import NewUser from "../NewUser";

export default function UserTab() {
  const [user, setUser] = useState<UserOutput>();

  return (
    <UserOutputContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route index element={<UserList />} />
        <Route path="edit/:id" element={<UserDetail />} />
        <Route path="new" element={<NewUser />} />
      </Routes>
    </UserOutputContext.Provider>
  );
}
