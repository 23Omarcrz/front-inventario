// Home.jsx
import { useNavigate } from "react-router-dom";
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Asumiendo que tu ruta de login es "/login"
  };

  const handleRegister = () => {
    navigate("/register"); // Asumiendo que tu ruta de login es "/login"
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Sistema de Inventario</h1>
        <p>Pasenme con 100</p>
        <button className="button" onClick={handleLogin}>
          Login
        </button>
        <button className="button" onClick={handleRegister}>
          Sign in
        </button>
      </div>
    </div>
  );
};
