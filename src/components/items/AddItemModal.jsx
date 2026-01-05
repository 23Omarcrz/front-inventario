import { useContext, useState, useEffect } from "react";
import "./AddItemModal.css";
import UsersContext from "../../context/UsersContext";

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

const AddItemModal = ({ onClose, addItem, selectedCategory}) => {
  const [form, setForm] = useState(initialForm); 
  const {validUser} = useContext(UsersContext);
  const [error, setError] = useState({});

  const handleChange = (e) => {
      setForm({
          ...form,
          [e.target.name]: e.target.value // actualiza solo el campo modificado
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //que los campos no esten vacios
    if (!validateInput()) {
        alert(error.form);
        return;
    }

    const insertar = {
      ...form,
      id_categoria: selectedCategory,
      valor: form.valor === "" ? "" : Number(form.valor)
    }

    //elimina todos los campos con ""
    const cleanForm = Object.fromEntries(
      Object.entries(insertar).filter(([_, value]) => value !== "")
    );

    addItem(cleanForm);
    handleReset();
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

        <h3>Agregar Nuevo Artículo de Inventario</h3>

        <form className="modal-form" onSubmit={handleSubmit}>

          <div className="row">
            <input type="text" className={error.no_inventario ? "error" : ""} placeholder="No_Inventario *" name="no_inventario" value={form.no_inventario} onChange={handleChange}/>
            <input type="text" placeholder="Usuario *" name="usuario" value={`${validUser.nombre} ${validUser.apellidos}`} disabled/>
          </div>

          <div className="row">
            <input type="text" placeholder="No_Serie" name="no_serie" value={form.no_serie} onChange={handleChange}/>
            <input type="text" placeholder="Marca" name="marca" value={form.marca} onChange={handleChange}/>
          </div>

          <textarea className={error.descripcion ? "error" : ""} placeholder="Descripción / Características *" name="descripcion" value={form.descripcion} onChange={handleChange}/>

          <div className="row">
            <input type="text" placeholder="Fabricante / Proveedor" name="fabricante" value={form.fabricante} onChange={handleChange}/>
            <input type="number" placeholder="Valor" name="valor" value={form.valor} onChange={handleChange}/>
          </div>

          <textarea placeholder="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange}/>

          <div className="row">
            <label htmlFor="F_Adquisicion">Fecha de Adquisicion</label>
            <label htmlFor="F_Asignacion">Fecha de Asignacion</label>
          </div>

          <div className="row">
              <input type="date" placeholder="Fecha de Adquisición" name="fecha_adquisicion" value={form.fecha_adquisicion} onChange={handleChange}/>
              <input type="date" placeholder="Fecha de Asignación" name="fecha_asignacion" value={form.fecha_asignacion} onChange={handleChange}/>
          </div>

          <div className="row">
            <input type="text" className={error.ubicacion ? "error" : ""} placeholder="Ubicación *" name="ubicacion" value={form.ubicacion} onChange={handleChange}/>
            <input type="text" placeholder="Resguardatario" name="resguardatario" value={form.resguardatario} onChange={handleChange}/>
          </div>

          <div className="row">
            <input type="text" placeholder="No. Interno DCC" name="no_interno_DCC" value={form.no_interno_DCC} onChange={handleChange}/>
            <input type="date" placeholder="Fecha de Última Revisión" name="fecha_ultima_revision" value={form.fecha_ultima_revision} onChange={handleChange}/>
          </div>

          <div className="row">
            <input type="text" placeholder="No. Oficio de Traspaso" name="no_oficio_traspaso" value={form.no_oficio_traspaso} onChange={handleChange}/>
            <select name="estatus" onChange={handleChange} defaultValue="">
              <option value="">Selecciona estatus</option>
              <option value="Ubicado">Ubicado</option>
              <option value="Traspaso">Traspaso</option>
              <option value="Perdido">Perdido</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          <div className="actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Agregar Artículo</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
