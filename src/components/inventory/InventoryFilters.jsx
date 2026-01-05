import { useModal } from "../../hooks/useModal";
import AddCategory from "../categories/AddCategory";
import Modal from "../Modal";

const InventoryFilters = ({categorias, onCategoryChange, addCategory}) => {
  const [isOpenAddCategory, openModalAddCategory, closeModalAddCategory] = useModal(false)

  const handleChange = (e) => {
    onCategoryChange(e.target.value);// actualiza solo el campo modificado
  }

  return (
    <>
      {isOpenAddCategory && (
        <Modal isOpen={isOpenAddCategory} closeModal={closeModalAddCategory}>
          <AddCategory addCategory={addCategory}/>
        </Modal>
      )}

      <div className="inventory-filters">
        <select name="categoria" onChange={handleChange}>
          {categorias.length === 0 ? <option>---------------</option> : categorias.map((el) => <option value={el.id_categoria} key={el.id_categoria}>{el.nombre}</option>)}
        </select>

        <button onClick={openModalAddCategory}>+ Nueva Categoría</button>
      </div>
    </>
  );
};

export default InventoryFilters;
