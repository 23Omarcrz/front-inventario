import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import AuthCard from "../AuthCard";
import AuthFooter from "../AuthFooter";
import dataFromApi from "../../api/axiosClient";
import "../styles/auth.css";
import AdminContext from "../../context/AdminContext";
import normalizeError from "../../api/normalizeError";
import { Link } from "react-router-dom";

const initialForm = {
    username: "",
    password: "",
}

export default function LoginPage() {
    const navigate = useNavigate();
    const {setAdmin} = useContext(AdminContext);
    const [form, setForm] = useState(initialForm); 
    const [error, setError] = useState({});

    //detecta los cambios dentro de un campo y asigna los valores a su respectiva variable
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value, // actualiza solo el campo modificado
        });
    }

    //hace una petición para el login
    const handleSubmit = async (e) => {
        e.preventDefault();
        //que los campos no estén vacios

        if(!validateInput()) return;

        //hace la peticion para verificar si el admin existe
        //si existe, nos manda al panel de admin
        try {
            let url = "auth"
            const endpoint = "/login";
            const result = await dataFromApi("post", url, endpoint, form)
            if(result.status === 200) {
                setAdmin(result.data.adminData);
                if (result.data.adminData) {
                    localStorage.setItem('admin', JSON.stringify(result.data.adminData));//Guardar datos en localStorage
                } 
                setError({});
                handleReset();
                navigate("/dashboard");
            }
        } catch (error) {
            const err = normalizeError(error);
            if(err.type === "NETWORK") return alert(err.message);
            if(err.type === "SERVER") return alert(err.message);
            if(err.type === "AUTH") return setError({inputError: err.message});
        }
        
    }

    const validateInput = () => {
        const newErrors = {};

        if(!form.username.trim()) {
            newErrors.username = true;
        }
        if(!form.password.trim()) {
            newErrors.password = true;
        }

        if(Object.keys(newErrors).length > 0) {
            newErrors.inputError = "Todos los campos son obligatorios";
            setError(newErrors);
            return false;
        }

        setError({});
        return true;
    }

    //limpia los campos despues de cada submit
    const handleReset = (e) => {
        setForm(initialForm)
    }

    return (
        <div className="auth-page">

            <AuthCard
                title="Sistema de Inventario"
                subtitle="Inicia sesión para acceder a tu cuenta"
                icon="/images/OIP.jpeg"
            >
                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="form-datos">
                    <TextInput 
                        label="Usuario *" 
                        type="text" name="username" 
                        placeholder="Tesjo2025" 
                        value={form.username} 
                        onChange={handleChange} 
                        error={error.username}
                        /* required */
                    />

                    <TextInput 
                        label="Contraseña *" 
                        type="password" name="password" 
                        value={form.password} 
                        onChange={handleChange} 
                        error={error.password} /* required */
                    />
                    
                    <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>
                    {<p className="login-error">{error.inputError}</p>}
                    {/* {error.inputError ? <p className="login-error">{error.inputError}</p> : <p className="login"></p>} */}

                    </div>

                    <div className="button-submit-login">
                        <PrimaryButton type="submit">
                            Iniciar Sesión
                        </PrimaryButton>
                    </div>

                </form>

                <AuthFooter text="¿No tienes una cuenta?" linkText="Crear Cuenta" linkHref="/register"
                />

            </AuthCard>

        </div>
    );
}
