import { useContext, useState} from "react";
import "./AddItemModal.css";
import UsersContext from "../../context/UsersContext";
import AddItemErrors from "./AddItemErrors";

const initialForm = {
  no_inventario: "",
  no_serie: "",
  marca: "",
  descripcion: "",
  fabricante: "",
  observaciones: "",
  valor: "",
  fecha_adquisicion: "",
  fecha_asignacion: "",
  ubicacion: "",
  resguardatario: "",
  no_interno_DCC: "",
  fecha_ultima_revision: "",
  no_oficio_traspaso: "",
  estatus: ""
}

const AddItemModal = ({ onClose, addItem, updateItem, selectedCategory, backendErrors, setBackendErrors}) => {
  const [form, setForm] = useState(initialForm); 
  const {validUser} = useContext(UsersContext);
  const [error, setError] = useState({});
  const [message, setMessage] = useState(null);
  const {editData, setEditData} = useContext(UsersContext);

  const handleChange = (e) => {
      setForm({
          ...form,
          [e.target.name]: e.target.value // actualiza solo el campo modificado
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors([]);
    setError({});
    setMessage(null);

    if (editData) {
      const editar = {
        ...form,
        valor: form.valor === "" ? "" : Number(form.valor)
      }
      
      const id_articulo = editData.id_articulo
      const response = await updateItem(editar, id_articulo);
      if(response === 204) {
        setMessage("Datos actualizados")
        setError({})
        handleReset();
      }
      return;
    }

    //que los campos no esten vacios
    if (!validateInput()) return;

    const insertar = {
      ...form,
      id_categoria: selectedCategory,
      valor: form.valor === "" ? "" : Number(form.valor)
    }

    const response = await addItem(insertar);
    if(response === 201) {
      setMessage("Artículo agregado")
      setError({})
      handleReset();
    }
  }

  const validateInput = () => {
        const newErrors = {};

        if(!form.no_inventario.trim()) {
            newErrors.no_inventario = true;
        }
        if(!form.descripcion.trim()) {
            newErrors.descripcion = true;
        }
        if(!form.ubicacion.trim()) {
            newErrors.ubicacion = true;
        }

        if(Object.keys(newErrors).length > 0) {
          newErrors.form = "Todos los campos son obligatorios";
          setError(newErrors);
          return false;
        }

        setError({});
        return true;
    }

  const handleReset = (e) => {
    setForm(initialForm)
  }

  return (
    <div className="modal-background">
      <div className="modal-card">

        <h3>{editData ? "Editar Artículo de Inventario" : "Agregar Nuevo Artículo de Inventario"}</h3>

          {backendErrors.length > 0 && (
            <AddItemErrors backendErrors={backendErrors}></AddItemErrors>
          )}
          
          {<div><p className={ Object.keys(error).length === 0 ? "message-success" : "add-item-error"}>
            {message ?? (Object.keys(error).length === 0 ? "" : "Llene los campos obligatorios")}
          </p></div>}
          {/* {Object.keys(error).length === 0 ? (<div><p className="add-item-error"></p></div>) : (<div><p className="add-item-error">Llene los campos obligatorios</p></div>)} */}
          {/* {message && <div><p className="message-success">{message}</p></div>} */}

        <form className="modal-form" onSubmit={handleSubmit}>

          <div className="row">
            <input type="text" className={error.no_inventario ? "error-add-item" : ""} placeholder="No_Inventario *" name="no_inventario" value={form.no_inventario} onChange={handleChange}/>
            <input type="text" placeholder="Usuario *" name="usuario" value={`${validUser.nombre} ${validUser.apellidos}`} disabled/>
          </div>

          <div className="row">
            <input type="text" placeholder="No_Serie" name="no_serie" value={form.no_serie} onChange={handleChange}/>
            <input type="text" placeholder="Marca" name="marca" value={form.marca} onChange={handleChange}/>
          </div>

          <textarea className={error.descripcion ? "error-add-item" : ""} placeholder="Descripción / Características *" name="descripcion" value={form.descripcion} onChange={handleChange} maxLength={150}/>

          <div className="row">
            <input type="text" placeholder="Fabricante / Proveedor" name="fabricante" value={form.fabricante} onChange={handleChange}/>
            <input type="number" placeholder="Valor" name="valor" value={form.valor} onChange={handleChange}/>
          </div>

          <textarea placeholder="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} maxLength={150}/>

          <div className="row">
            <label>Fecha de Adquisición</label>
            <label>Fecha de Asignación</label>
          </div>

          <div className="row">
              <input type="date" placeholder="Fecha de Adquisición" name="fecha_adquisicion" value={form.fecha_adquisicion} onChange={handleChange}/>
              <input type="date" placeholder="Fecha de Asignación" name="fecha_asignacion" value={form.fecha_asignacion} onChange={handleChange}/>
          </div>

          <div className="row">
            <input type="text" className={error.ubicacion ? "error-add-item" : ""} placeholder="Ubicación *" name="ubicacion" value={form.ubicacion} onChange={handleChange}/>
            <input type="text" placeholder="Resguardatario" name="resguardatario" value={form.resguardatario} onChange={handleChange}/>
          </div>

          <div className="row">
            <label></label>
            <label>Fecha de última revisión</label>
          </div>

          <div className="row">
            <input type="text" placeholder="No. Interno DCC" name="no_interno_DCC" value={form.no_interno_DCC} onChange={handleChange}/>
            <input type="date" placeholder="Fecha de Última Revisión" name="fecha_ultima_revision" value={form.fecha_ultima_revision} onChange={handleChange}/>
          </div>

          <div className="row">
            <input type="text" placeholder="No. Oficio de Traspaso" name="no_oficio_traspaso" value={form.no_oficio_traspaso} onChange={handleChange}/>
            <select name="estatus" value={form.estatus} onChange={handleChange}>
              <option value="">Selecciona estatus</option>
              <option value="Ubicado">Ubicado</option>
              <option value="Traspaso">Traspaso</option>
              <option value="Perdido">Perdido</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          <div className="actions">
            <button className="button-modal-actions" type="button" onClick={() => {
              setEditData(null);
              setBackendErrors([]);
              onClose();
            }}>Cancelar</button>
            <button className="button-modal-actions" type="submit">{editData ? "Editar Artículo" : "Agregar Artículo"}</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
