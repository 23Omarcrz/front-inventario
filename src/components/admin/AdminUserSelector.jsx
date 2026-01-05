import DynamicUserSelect from "./DynamicUserSelect";
import "./AdminUserSelector.css"
import { useState, useContext, useEffect } from "react";
import AdminContext from "../../context/AdminContext";
import dataFromApi from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import UsersContext from "../../context/UsersContext";

export default function AdminUserSelector() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const {admin} = useContext(AdminContext);
  const {setValidUser} = useContext(UsersContext);

  //carga los usuarios correspondientes al admin al cargar el panel por primera vez
  useEffect(() => {
    if (!admin || !admin.id_admin) return; // no hacer nada si no hay admin válido
    
    //hace una peticion para traer a los usuarios correspondientes al admin
    const getUsers = async (id_admin) => {
      try {
        const url = `admin/${id_admin}/usuarios`; 
        const usuarios = await dataFromApi("get", url, "", "");
        setUsers(usuarios.data.users)
      } catch (error) {
        //alert(error.response.message)
        if (!error.response) {
                // Esto indica que NO hubo respuesta
                return alert("No se pudo conectar con el servidor.");
            }
        console.log(error.response);
      }
      
    }

    getUsers(admin.id_admin);
  }, []);
  /* const handleSubmit = () => {

  } */

  //Por seguridad, verifica que, efectivamente, el admin seleccionado existe.
  const handleSelectedUser = async (user) => {
    if (!user || !user.id_usuario) return; // no hacer nada si no hay usuario válido
    //verificamos si el usuario existe y lo asignamos a userSelected
      try {
        const url = `admin/${admin.id_admin}/usuario/${user.id_usuario}`;
        const usuario = await dataFromApi("get", url, "", "");

        console.log(usuario)
        if(usuario.data.success) {
          setValidUser(user)
          localStorage.setItem('validUser', JSON.stringify(user));//Guardar datos en localStorage
          navigate("/inventario");
        }
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <div className="container">

        <h2 className="nav-admin">Panel de administracion</h2>


      <div className="card">
        <div className="card-select">
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
            <button className="admin-button button-action">Agregar</button>
            <button className="admin-button button-action">Eliminar</button>
            <button className="admin-button button-action">Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

