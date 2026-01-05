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

const initialForm = {
    username: "",
    password: "",
}

export default function LoginPage() {
    const navigate = useNavigate();
    const {setAdmin} = useContext(AdminContext);
    const [error, setError] = useState({});

    const [form, setForm] = useState(initialForm); 

    //detecta los cambios dentro de un campo y asigna los valores a su respectiva variable
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value, // actualiza solo el campo modificado
        });
    }

    //hace una peticion para el login
    const handleSubmit = async (e) => {
        e.preventDefault();
        //que los campos no esten vacios

        if(!validateInput()) return;

        //hace la peticion para verificar si el admin existe
        //si existe, nos manda al panel de admin
        try {
            let url = "auth"
            const endpoint = "/login";
            const result = await dataFromApi("post", url, endpoint, form)
            if(result.status === 200) {
                //LOGIN EXITOSO
                console.log(result.data)
                setAdmin(result.data.adminData);
                if (result.data.adminData) {
                    localStorage.setItem('admin', JSON.stringify(result.data.adminData));//Guardar datos en localStorage
                } 
                /* por ejemplo
                        {
                            id_admin: 1,
                            nombre: "Juan",
                            apellidos: "Pérez",
                            usernameAdmin: "juan123"
                        }
                            convierte ese objeto en una cadena de texto (string) en formato JSON:
                            '{"id_admin":1,"nombre":"Juan","apellidos":"Pérez","usernameAdmin":"juan123"}'
                */
                navigate("/dashboard");
            }

            handleReset();
        } catch (error) {
            const err = normalizeError(error);
            if(err.type === "NETWORK") alert(err.message)
            if(err.type === "SERVER") alert(err.message)
            if(err.type === "AUTH") setError({form: err.message})
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
            newErrors.form = "Todos los campos son obligatorios";
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

                    <TextInput
                        label="Usuario *"
                        type="text"
                        name="username"
                        placeholder="Tesjo2025"
                        value={form.username} onChange={handleChange}
                        error={error.username}
                    />


                        <TextInput
                            label="Contraseña *"
                            type="password"
                            name="password"
                            value={form.password} onChange={handleChange}
                            error={error.password}
                        />
                        {/* <a href="#" className="forgot-link">
                            ¿Olvidaste tu contraseña?
                        </a> */}
                        {error.form ? <p>{error.form}</p> : <p></p>}
                    

                    {/* <div className="checkbox-row">
                        <input id="remember" type="checkbox" />
                        <label htmlFor="remember">Recordarme</label>
                    </div> */}

                    <div className="button-submit-login">
                        <PrimaryButton type="submit">
                            Iniciar Sesión
                        </PrimaryButton>
                    </div>

                </form>

                <AuthFooter
                    text="¿No tienes una cuenta?"
                    linkText="Crear Cuenta"
                    linkHref="/register"
                />

            </AuthCard>

        </div>
    );
}
