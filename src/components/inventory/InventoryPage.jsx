import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import InventoryActions from "./InventoryActions";
import AddItemModal from "../items/AddItemModal";
import { InventoryPagination } from "./InventoryPagination";
import { useEffect, useState, useContext } from "react";
import UsersContext from "../../context/UsersContext";
import dataFromApi from "../../api/axiosClient";
import { useModal } from "../../hooks/useModal";
import Modal from "../Modal";
import "./Inventory.css"
import normalizeError from "../../api/normalizeError";

const InventoryPage = () => {
  const {validUser} = useContext(UsersContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState([]); // datos tabla
  const [isOpenError, openModalError, closeModalError] = useModal(false)
  const [error, setError] = useState({})

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosPorPagina] = useState(5);
  const [totalPaginas, setTotalPaginas] = useState(0);

  //Se obtinene las categorias del usuario al cargar el panel
  useEffect(()=> {
    if (!validUser || !validUser.id_usuario) return; // no hacer nada si no hay usuario válido
    
    //metodo para obtener las categorias
    const getCategories = async (id_usuario) => {
      try {
        const url = `inventario/usuario/${id_usuario}/categorias`; 
        const result = await dataFromApi("get", url, "", "");
        setCategories(result.data.categorias)
        if (result.data.categorias.length > 0) {
          setSelectedCategory(result.data.categorias[0].id_categoria);
        } else {
          setSelectedCategory(null);
        }
      } catch (error) {
        //alert(error.response.message)
        if (!error.response) {
          // Esto indica que NO hubo respuesta
          return alert("No se pudo conectar con el servidor:(");
        }
        alert(error.response.data.message);
      }
    }

    //llamamos al metodo
    getCategories(validUser.id_usuario);
  },[]);

  // 🔽 NUEVO
  useEffect(() => {
    if (!validUser || !selectedCategory) return;

    const getInventory = async () => {
      const filtros = {
        id_usuario: validUser.id_usuario,
        id_categoria: selectedCategory,
        page: paginaActual,
        limit: datosPorPagina
      };
      const params = new URLSearchParams(filtros).toString();//Convertir el objeto en query params quedando de la siguiente forma por ejemplo
      //                                                       /inventario/usuario/categoria/articulos?id_usuario=5&id_categoria=3&page=1&limit=10

      try {
        const url = `inventario/usuario/categoria/articulos?${params}`;
        const result = await dataFromApi("get", url, "");

        setItems(result.data.items);
        setTotalPaginas(result.data.totalPages);
      } catch (error) {
        //alert(error.response.message)
        if (!error.response) {
          // Esto indica que NO hubo respuesta
          return alert("No se pudo conectar con el servidor.");
        }
        alert(error.response.data.message);
      }
    };

    getInventory();
  }, [validUser, selectedCategory, paginaActual]);

  // 🔽 NUEVO
  const handleCategoryChange = (id_categoria) => {
    setSelectedCategory(id_categoria);
    setPaginaActual(1);
  };

  const handleDelet = async (id_articulo) => {
    const acepto = confirm("¿Estás seguro de eliminar este articulo?");
    if (acepto) {
      try {
        const url = `inventario/usuario/categoria/delete/articulo/${id_articulo}`;
        const result = await dataFromApi("delete", url, "");
        alert(result.data.message)
      } catch (error) {
        if(!error.response) {
          return alert("No se pudo conectar con el servidor");
        }
        alert(error.response.data.message);
      }
    }
  }

  const handleAddCategory = async (body) => {
    try {
      const url = `inventario/usuario/categoria/agregar`;
      const result = await dataFromApi("post", url, "", body);
      return result.status;
    } catch (error) {
      const err = normalizeError(error);
      if(err.type === "NETWORK") return alert(err.message)
      if(err.type === "SERVER") return err.message
      if(err.type === "VALIDATION" || err.type === "ER_DUP_ENTRY") return err.errors
    }
  }

  const handleImportFile = async(file) => {
    try {
      const url = `inventario/usuario/categoria/import/articulos`;
      const result = await dataFromApi("post", url, "", file)
    } catch (error) {
      if(!error.response) {
        return alert("No se pudo conectar con el servidor");
      }
      openModalError();

      if (error.response.status === 409) {
        const validationErrors = error.response.data.error;
        validationErrors.forEach(err => {
          //console.log(err.path[0], err.message, err.userValue);
        });
      }

      alert(error.response.data.message);
    }
  } 

  const handleAddItem = async (form) => {
    try {
      const url = `inventario/usuario/categoria/articulo/agregar`;
      const result = await dataFromApi("post", url, "", form)
    } catch (error) {
      if(!error.response) {
        return alert("No se pudo conectar con el servidor");
      }
      console.log("hola mundo")

      if (error.response.status === 400) {
        const validationErrors = error.response.data.error;
        let mensaje = "";
        validationErrors.forEach(err => {
            console.log(err.path[0], err.message, err.userValue);
            mensaje += `${err.path[0]} ${err.message} ${err.userValue}`
        });
        alert(mensaje);
      } else {
          // manejar errores de negocio o internos
          /* if(error.response.data.code === "EMAIL_DUPLICATED") {
              setExistEmail("Este correo ya esta en uso")
          } else {
              setExistEmail(null)
          }
          if(error.response.data.code === "USERNAME_DUPLICATED") {
              setExistUsername("El username ya esta en uso")
          } else {
              setExistUsername(null)
          } */
          alert(error.response.data.message);
      }
    }
    //items.push(form)
    //alert(`Datos enviados.`)
  }

  return (
    <div className="inventory-container">
      {modalOpen && <AddItemModal onClose={() => setModalOpen(false)} addItem={handleAddItem} items={items} modalOpen={modalOpen} selectedCategory={selectedCategory}/>}
      <Modal isOpen={isOpenError} closeModal={closeModalError}>
        <h3>Errores</h3>
        <div>
        </div>
      </Modal>

      <h2>Panel de Inventario</h2>

      <div className="inventory-header">
        <div>
          <h3>Registro de inventario</h3>
          <p>{`${validUser.nombre} ${validUser.apellidos}`}</p>
        </div>

        <div className="inventory-header-content">
          <InventoryFilters categorias={categories} onCategoryChange={handleCategoryChange} addCategory={handleAddCategory}/>
          <InventoryActions onAddItem={() => setModalOpen(true)} setItems={setItems} items={items} importFile={handleImportFile} selectedCategory={selectedCategory}/>
        </div>
      </div>

      <InventoryTable datos={items} categoria={selectedCategory} onAddItem={() => setModalOpen(true)} onDeleteItem={handleDelet}/>
      <InventoryPagination paginaActual={paginaActual} totalPaginas={totalPaginas} onChange={setPaginaActual}></InventoryPagination>
    </div>
  );
};

export default InventoryPage;