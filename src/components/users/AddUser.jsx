import { useState } from "react";
import "./addUser.css"
import TextInput from "../TextInput";
import dataFromApi from "../../api/axiosClient";
import normalizeError from "../../api/normalizeError";

const initialForm = {
  nombre: "",
  apellidos: "",
  cargo: "",
  area: ""
}

const AddUser = ({setUsers}) => {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState({});
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({...form, 
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateInput()) return;
        console.log(form)

        try {
            const url = "admin"
            const endpoint = "/usuario/nuevoUsuario"
            const result = await dataFromApi("post", url, endpoint, form);
            setUsers(prevUsers => [...prevUsers, result.data.newUser])  //“toma la lista MÁS RECIENTE de usuarios que tenga y agrega este nuevo usuario”
            setMessage("Usuario agregado");
            setError({})
            handleReset();
        } catch (error) {
            setMessage(null)
            const err = normalizeError(error)
            if(err.type === "NETWORK") alert(err.message)
            if(err.type === "SERVER") alert(err.message)
            if(err.type === "VALIDATION") setError(err.errors)
            if(err.type === "ER_DUP_ENTRY") setError(err.errors)
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

        if(Object.keys(newErrors).length > 0) {
            newErrors.form = "Llene los campos obligatorios";
            setError(newErrors);
            return false;
        }

        setError({});
        return true;
    }

    const handleReset = () => {
        setForm(initialForm);
    } 

    return (
        <div className="container-add-category">
            <h3>Agregar nuevo usuario</h3>
            <form onSubmit={handleSubmit} className="form-add-user">
                <div className="user-form-row">
                    <TextInput
                    label="Nombre *"
                    type="text" 
                    name="nombre" 
                    value={form.nombre} onChange={handleChange} 
                    error={error.nombre}/>

                    <TextInput
                    label="Apellidos *"
                    type="text" 
                    name="apellidos" 
                    value={form.apellidos} onChange={handleChange} 
                    error={error.apellidos}/>
                </div>

                <div className="user-form-row">
                    <TextInput
                    label="Cargo"
                    type="text" 
                    name="cargo" 
                    value={form.cargo} onChange={handleChange} 
                    error={error.cargo}/>

                    <TextInput
                    label="Area"
                    type="text" 
                    name="area" 
                    value={form.area} onChange={handleChange} 
                    error={error.area}/>
                </div>
                <p className={`addUser-message ${message ? "addUser-success" : "addUser-error"}`}>
                    {message ?? (error.form ?? error.usuario) }
                </p>

                <input className="button-add-category" type="submit" value="Agregar" />
            </form>
            
        </div>
    )
}

export default AddUser;