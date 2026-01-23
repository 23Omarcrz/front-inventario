import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import AddCategory from "../categories/AddCategory";
import Menu from "../Menu";
import Modal from "../Modal";
import Notification from "../Notification";

const InventoryFilters = ({categorias, onCategoryChange, addCategory, selectedCategory, deleteCategory}) => {
  const [isOpenAddCategory, openModalAddCategory, closeModalAddCategory] = useModal(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const value = Number(e.target.value);
    onCategoryChange(Number.isNaN(value) ? null : value);// actualiza solo el campo modificado
  } 

  const handleDelete = () => {
    if(!selectedCategory) {
      setMessage("No se ha seleccionado ninguna categoría")
      setOpenAlert(true);
      return;
    }

    const mensaje = `La categoría "${categorias.find(cat => cat.id_categoria === selectedCategory).nombre}" y todos los artículos relacionados con ella serán eliminados`
    setMessage(mensaje);
    setOpenConfirm(true);
  } 

  return (
    <>
      {isOpenAddCategory && (
        <Modal isOpen={isOpenAddCategory} closeModal={closeModalAddCategory}>
          <AddCategory addCategory={addCategory}/>
        </Modal>
      )}

      {openConfirm && <Notification
        isOpen={openConfirm}
        title="⚠️ ¿Seguro que desea realizar la siguiente acción?"
        message={message}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          deleteCategory();
          setOpenConfirm(false);
        }}
        confirmText="Eliminar"
      />}

      {openAlert && <Notification
        isOpen={openAlert}
        title="Notificación"
        message={message}
        onClose={() => setOpenAlert(false)}
      />}

      <div className="inventory-filters">
        <select className="filter-categories" name="categoria" onChange={handleChange}>
          {categorias.length === 0 ? 
            <option>---------------</option> : 
            <>
              <option value={null} >Ver todo</option>
              {categorias.map((el) => <option value={el.id_categoria} key={el.id_categoria}>{el.nombre}</option>)}
            </>
          }
        </select>

        <Menu
          title={"Acciones"}
          items={[{name: "Agregar Categoría", action: openModalAddCategory},
                  {name: "Eliminar Categoría", action: handleDelete}
          ]}/>
        
      </div>
    </>
  );
};

export default InventoryFilters;
