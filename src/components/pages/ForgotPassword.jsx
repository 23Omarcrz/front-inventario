import { useState } from "react";
import dataFromApi from "../../api/axiosClient";
import "../styles/auth.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    try {
      setLoading(true);
      const url = "auth/forgot-password"; // endpoint backend
      const result = await dataFromApi("post", url, "", { email });
      setMessage(result.data.message || "Se enviaron las instrucciones a tu correo");
      setEmail("");
    } catch (err) {
      if (!err.response) {
        return alert("No se pudo conectar con el servidor");
      } 
      if(err.response.status === 400) {
        return setError(err.response.data.message);
      }

      return alert(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
        <div className="forgot-password-card">
            <h3 className="forgot-password-title">¿Olvidaste tu contraseña?</h3>
            <p className="forgot-password-subtitle">Ingresa tu correo electrónico y te enviaremos instrucciones para restaurarla.</p>

            <form onSubmit={handleSubmit} className="forgot-password-form">
                <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                />

                {<p className={`forgot-message ${error ? "forgot-error" : "forgot-success"}` }>
                    {message ?? error}
                </p>}

                <button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
                </button>
            </form>

            <div className="auth-footer">
              <Link to="/login">Iniciar sesión</Link>
            </div>
        </div>
    </div>
  );
};

export default ForgotPassword;
