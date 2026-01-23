import { createContext, useContext, useState, useEffect } from "react";
import AdminContext from "./AdminContext";

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [validUser, setValidUser] = useState(() => {
        const storedUser = localStorage.getItem('validUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [editData, setEditData] = useState(null); 

    const {admin} = useContext(AdminContext)

    useEffect(() => {
        if (!admin) {
        // Si el admin desaparece, limpiamos user
        setValidUser(null);
        localStorage.removeItem("validUser");
        }
    }, [admin]);

    const data = {users, setUsers, validUser, setValidUser, editData, setEditData};

    return <UsersContext.Provider value={data}>{children}</UsersContext.Provider>
}

export {UsersProvider};
export default UsersContext;