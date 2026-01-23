import { useNavigate } from "react-router-dom"
import './styles/navbar.css';
import logoutIcon from '../assets/logout_icon.svg'
import { useContext } from "react";
import AdminContext from "../context/AdminContext";
import UsersContext from "../context/UsersContext";
import dataFromApi from "../api/axiosClient";

const Navbar = () => {
  const navigate = useNavigate()
  const {setAdmin} = useContext(AdminContext)
  const {setValidUser} = useContext(UsersContext)

  const handleLogout = async (e) => {
    e.preventDefault();
        try {
            let url = "auth"
            const endpoint = "/logout";
            const result = await dataFromApi("post", url, endpoint)
            alert(result.data.message)
        } catch (error) {
            console.log(error);
        }
    // Aquí puedes limpiar el token o la sesión del usuario
    localStorage.removeItem("admin") // ejemplo
    setAdmin(null)
    localStorage.removeItem("validUser") // ejemplo
    setValidUser(null)
    navigate("/login") // redirige al login
  }

  return (
    <nav className="nav-container">
      <h1 className="nav-title">Sistema de Inventario Dep. de Centro de Cómputo</h1>
      <button className="button-logout" onClick={handleLogout}>
        <img src={logoutIcon}/>Cerrar sesión
      </button>
    </nav>
  )
}

export default Navbar;