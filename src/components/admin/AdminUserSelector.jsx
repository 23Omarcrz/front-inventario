import DynamicUserSelect from "./DynamicUserSelect";
import "./AdminUserSelector.css"
import { useState, useContext, useEffect } from "react";
import AdminContext from "../../context/AdminContext";
import dataFromApi from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import UsersContext from "../../context/UsersContext";
import { useModal } from "../../hooks/useModal";
import AddUser from "../users/AddUser";
import Modal from "../Modal";
import adelanteIcon from '../../assets/adelante.png'
import DeleteUsersModal from "../users/DeleteUser";
import Notification from "../Notification";

export default function AdminUserSelector() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const {admin} = useContext(AdminContext);
  const {setValidUser, validUser} = useContext(UsersContext);
  const [isOpenAddUser, openModalAddUser, closeModalAddUser] = useModal(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  //carga los usuarios correspondientes al admin al cargar el panel por primera vez
  useEffect(() => {
    if (!admin || !admin.id_admin) return; // no hacer nada si no hay admin válido
    
    //hace una petición para traer a los usuarios correspondientes al admin
    const getUsers = async () => {
      try {
        const url = `admin/usuarios`; 
        const result = await dataFromApi("get", url, "", "");
        setUsers(result.data.users);
      } catch (error) {
        if (!error.response) {
          // Esto indica que NO hubo respuesta
          return alert("No se pudo conectar con el servidor.");
        }

        if(error.response.status === 400) {
          return alert("Administrador no válido");
        }

        return alert(error.response.data.message);
      }
    }

    getUsers(admin.id_admin);
  }, []);

  //Por seguridad, verifica que, efectivamente, el admin seleccionado existe.
  const handleSelectedUser = async (user) => {
    if (!user || !user.id_usuario) return; // no hacer nada si no hay usuario válido
    //verificamos si el usuario existe y lo asignamos a userSelected
      try {
        const url = `admin/usuario/${user.id_usuario}`;
        const usuario = await dataFromApi("get", url, "", "");

        if(usuario.data.success) {
          setValidUser(user);
          localStorage.setItem('validUser', JSON.stringify(user));//Guardar datos en localStorage
          navigate("/inventario");
        }
      } catch (error) {
        if(!error.response) return alert("No se pudo conectar con el servidor");
        if(error.response.status === 400) return alert(error.response.data.message);
        if(error.response.status === 404) return alert("El usuario no existe");

        return alert(error.response.data.message);
      }
  };

  return (
    <div className="container">
      {isOpenAddUser && (
        <Modal isOpen={isOpenAddUser} closeModal={closeModalAddUser}>
          <AddUser setUsers={setUsers}/>
        </Modal>
      )}
      
      <DeleteUsersModal
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          users={users}
          setUsers={setUsers}
          setOpenAlert={setOpenAlert}
      />

      {openAlert && <Notification
        isOpen={openAlert}
        title="Notificación"
        message={"Usuarios eliminados correctamente"}
        onClose={() => setOpenAlert(false)}
      />}

      <div className="card">
        <div className="card-select">
          <div className="adelantar">
            <button 
              className={validUser ? "ir enable" : "ir disable"} 
              onClick={() => navigate("/inventario")}
              disabled={validUser === null ? true:false}>
              <img src={adelanteIcon} alt="Back"/>
            </button>
          </div>
          <div>
            <h2 className="title">{`${admin.nombre} ${admin.apellidos}`}</h2>
            <p>{`${admin.username}`}</p>
          </div>

          <div className="section">
            <label>Seleccionar Usuario</label>
            <DynamicUserSelect
              users={users}
              onSelect={handleSelectedUser}
            />
          </div>

          <div className="action">
            <button className="admin-button button-action" onClick={() => openModalAddUser(true)}>Agregar</button>
            {<button className="admin-button button-action" onClick={() => setOpenDelete(true)}>Eliminar</button>}
            {/* <button className="admin-button button-action">Editar</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

