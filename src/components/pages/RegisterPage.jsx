import { useState } from "react";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import AuthCard from "../AuthCard";
import AuthFooter from "../AuthFooter";
import "../styles/auth.css";
import dataFromApi from "../../api/axiosClient";
import normalizeError from "../../api/normalizeError";

const initialForm = {
    nombre: "",
    apellidos: "",
    email: "",
    username: "",
    password: "",
}

export default function RegisterPage() {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState({});
    const [message, setMessage] = useState(null);

    //detecta los cambios dentro de un campo y asigna los valores a su respectiva variable
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value, // actualiza solo el campo modificado
        });
    }

    //hace una petición para agregar un nuevo admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        //que los campos no esten vacios
        if (!validateInput()) return;

        //hace la peticion y envia los datos para registrarlos
        //el backend valida que los datos sean tipos de datos válidos para cada campo
        try {
            let url = 'auth';
            const endpoint = "/register";
            const result = await dataFromApi("post", url, endpoint, form);
            if (result.status === 201);
            setMessage(result.data.message);
            setError({});
            handleReset();
        } catch (error) {
            setMessage(null);
            const err = normalizeError(error);
            if(err.type === "NETWORK") return alert(err.message);
            if(err.type === "SERVER") return alert(err.message);
            if(err.type === "VALIDATION" || err.type === "ER_DUP_ENTRY") return setError(err.errors);
        }
    }

    const validateInput = () => {
        const newErrors = {};

        if(!form.nombre.trim()) {
            newErrors.nombre = true;
        }
        if(!form.apellidos.trim()) {
            newErrors.apellidos = true;
        }
        if(!form.email.trim()) {
            newErrors.email = true;
        }
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
                title="Crear Cuenta"
                subtitle="Registra tus datos para comenzar"
                icon="/images/OIP.jpeg"
            >
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-datos">

                        <div className="form-row">
                            <TextInput 
                            label="Nombre *" 
                            type="text" name="nombre" 
                            value={form.nombre} 
                            onChange={handleChange} 
                            error={error.nombre}/>
                            <TextInput label="Apellidos *" type="text" name="apellidos" value={form.apellidos} onChange={handleChange} error={error.apellidos}/>
                        </div>

                        <div className="form-row">
                            <TextInput label="Correo Electrónico *" type="email" name="email" value={form.email} onChange={handleChange} error={error.email}/>

                            <TextInput label="Nombre de Usuario *" type="text" name="username" value={form.username} onChange={handleChange} error={error.username}/>
                        </div>
                        
                        <div className="form-row">
                            <TextInput label="Contraseña *" type="password" name="password" value={form.password} onChange={handleChange}  error={error.password}/>
                        </div>

                        {<p className={`register-message ${error.inputError ? "register-error" : "register-success"}` }>
                            {message ?? error.inputError}
                        </p>}
                    </div>

                    <div className="button-submit-register">
                        <PrimaryButton type="submit">
                            Registrarme
                        </PrimaryButton>
                    </div>

                </form>

                <AuthFooter text="¿Ya tienes una cuenta?" linkText="Iniciar sesión" linkHref="/login"/>

            </AuthCard>

        </div>
    );
}
