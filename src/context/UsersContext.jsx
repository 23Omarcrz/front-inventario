import { createContext, useState } from "react";

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState();
    const [validUser, setValidUser] = useState(() => {
        const storedUser = localStorage.getItem('validUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const data = {users, setUsers, validUser, setValidUser};

    return <UsersContext.Provider value={data}>{children}</UsersContext.Provider>
}

export {UsersProvider};
export default UsersContext;