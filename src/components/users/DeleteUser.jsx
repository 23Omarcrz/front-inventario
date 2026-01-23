import { useState, useEffect, useContext } from "react";
import "./deleteUser.css";
import dataFromApi from "../../api/axiosClient";
import UsersContext from "../../context/UsersContext";

const DeleteUsersModal = ({ isOpen, onClose, users, setUsers, setOpenAlert }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {validUser, setValidUser } = useContext(UsersContext);

    // 🔹 Resetear estado al abrir
    useEffect(() => {
        if (isOpen) {
            setSelectedUsers([]);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((u) => u !== id)
                : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (selectedUsers.length === 0) {
            setError("Selecciona al menos un usuario");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const url = "admin"
            const endpoint = "/usuarios/delete"
            const result = await dataFromApi("delete", url, endpoint, selectedUsers);
            //setMessage("Usuarios eliminados correctamente");
            const deletedIds = result.data.deletedUsers;
            onClose();
            setOpenAlert(true);
            setUsers(prevUsers =>
                prevUsers.filter(
                    user => !deletedIds.includes(user.id_usuario)
                )
            );

            setValidUser(prevSelected => {
                if (!prevSelected) return null;

                if (deletedIds.includes(prevSelected.id_usuario)) {
                    localStorage.removeItem("selectedUser");
                    return null;
                }

                return prevSelected;
            });
        } catch (error) {
            if(!error.response) return alert("No se pudo conectar con el servidor");
            if(error.response.status === 401 || 
                error.response.status === 409 || 
                error.response.status === 403) return setError(error.response.data.message);

            return alert(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container container-add-category">
                <div className="header-deleteUser">
                    <h3>⚠️ Eliminar usuarios</h3>
                    <p>
                        Los usuarios seleccionados y todas sus categorías y artículos
                        relacionados serán eliminados de forma permanente.
                    </p>
                </div>

                {/* LISTA DE USUARIOS */}
                <div className="user-list">
                    {users.length === 0 && (
                        <p>No hay usuarios para eliminar.</p>
                    )}

                    {users.map((user) => (
                        <label key={user.id_usuario} className="user-item">
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(
                                    user.id_usuario
                                )}
                                onChange={() =>
                                    toggleUser(user.id_usuario)
                                }
                            />
                            {user.nombre} {user.apellidos}
                        </label>
                    ))}
                </div>

                {/* MENSAJES */}
                <p className={`message-delete-user ${error ? "error" : "success"}`}>
                    {error}
                </p>

                {/* ACCIONES */}
                <div className="actions">
                    <button className="action-delete-user" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button
                        className="action-delete-user danger"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUsersModal;
