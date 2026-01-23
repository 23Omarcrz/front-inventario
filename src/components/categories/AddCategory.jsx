import { useContext, useEffect, useState } from "react";
import "./addCategory.css"
import UsersContext from "../../context/UsersContext";
import TextInput from "../TextInput";

const initialForm = {
  id_usuario: "",
  nombre_categoria: "",
}

const AddCategory = ({addCategory}) => {
    const [form, setForm] = useState(initialForm);
    const {validUser} = useContext(UsersContext);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        initialForm.id_usuario = validUser.id_usuario;
    },[])
    
    const handleChange = (e) => {
        setForm({...form, 
            [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        
        if (
            //!form.id_usuario ||
            !form.nombre_categoria.trim()
        ) {
            setError("Agregue un nombre a la categoría")
            return;
        }
        const result = await addCategory(form);
        if(result === 201){
            setMessage("Categoría agregada");
            setError(null);
            handleReset();
            return
        } else if(typeof result === "object"){
            setError(result.nombre_categoria)
            return
        } else {
            setError(result);
            return
        }
    }

    const handleReset = () => {
        setForm(initialForm);
    } 

    return (
        <div className="container-add-category">
            <h3>Agregar nueva categoría</h3>
            <form onSubmit={handleSubmit}>
                <TextInput 
                label="Nombre de la categoría"
                type="text" 
                name="nombre_categoria" 
                placeholder="Ejem: Computadoras..." 
                value={form.nombre_categoria} onChange={handleChange} 
                error={error}/>
                {<p className="message-add-category">
                    {message}
                </p>}

                <input className="button-add-category" type="submit" value="Agregar" />
            </form>
        </div>
    )
}

export default AddCategory;