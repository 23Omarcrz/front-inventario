import { createContext, useEffect, useState } from "react";
import dataFromApi from "../api/axiosClient";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(() => {
        const storedAdmin = localStorage.getItem('admin');
        return storedAdmin ? JSON.parse(storedAdmin) : null;
    });


    /* 
        localStorage.getItem('admin') devuelve el string que guardaste, por ejemplo:
        '{"id_admin":1,"nombre":"Juan","apellidos":"Pérez","usernameAdmin":"juan123"}'
        Nota: si no existe la clave "admin", devuelve null.
        JSON.parse(storedAdmin) convierte el string JSON de vuelta a un objeto JavaScript:

        {
        id_admin: 1,
        nombre: "Juan",
        apellidos: "Pérez",
        usernameAdmin: "juan123"
        }

        Si storedAdmin es null, el ternario devuelve null.
    */

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await dataFromApi("get", "auth", "/session")
                setAdmin(res.data.adminData);
                localStorage.setItem("admin", JSON.stringify(res.data.adminData));
            } catch (error) {
                setAdmin(null);
                localStorage.removeItem("admin"); // ✅ CLAVE
            }
        }

        checkSession()
    }, [])

    const data = {admin, setAdmin};

    return <AdminContext.Provider value={data}>{children}</AdminContext.Provider>
}

export {AdminProvider}
export default AdminContext;