import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dataFromApi from "../../api/axiosClient";
import "../styles/resetPassword.css";
import TextInput from "../TextInput";
import normalizeError from "../../api/normalizeError";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError({})
        setLoading(false);
        setMessage(null);
        if (password !== confirmPassword) {
            return setError({
                code: "NOT_MATCH",
                message: "Las contraseñas no coinciden"});
        }

        setLoading(true);
        setMessage(null);

        try {
            await dataFromApi("post", "auth/reset-password", "", {
                token,
                password,
            });

            setMessage("Contraseña actualizada correctamente");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.log(error)
            if(!error.response) return alert("No se pudo conectar con el servidor")
                
            if(error.response.status === 400 && error.response.data.code === "NO_VALID_TOKEN") {
                setError({
                    code: "NO_VALID_TOKEN",
                    message: error.response.data.message
                })
            }

            if(error.response.status === 400 && error.response.data.code !== "NO_VALID_TOKEN") {
                const err = normalizeError(error);
                if(err.type === "NETWORK") return alert(err.message)
                if(err.type === "SERVER") return alert(err.message)
                if(err.type === "VALIDATION" || err.type === "ER_DUP_ENTRY") return setError(err.errors)
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page">
        <div className="reset-card">
            <h2 className="reset-title">Nueva contraseña</h2>
            <p className="reset-subtitle">
            Ingresa tu nueva contraseña
            </p>

            <form className="reset-form" onSubmit={handleSubmit}>
                <TextInput
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    error={error.password}>
                </TextInput>

                <TextInput
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required>
                </TextInput>

                <p className={`reset-message ${(error.code === "NO_VALID_TOKEN" || error.code === "NOT_MATCH") ? "reset-error" : "reset-success"}` }>
                    {message ?? ((error.code === "NO_VALID_TOKEN" || error.code === "NOT_MATCH") && error.message)}
                </p>

            <button className="reset-btn" disabled={loading}>
                {loading ? "Guardando..." : "Cambiar contraseña"}
            </button>
            </form>
        </div>
        </div>
    );
};

export default ResetPassword;
