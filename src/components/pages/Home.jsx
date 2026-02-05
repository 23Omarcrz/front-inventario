import { useNavigate } from "react-router-dom";
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); 
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Sistema de Inventario</h1>
        <p>Centro de Cómputo</p>
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
