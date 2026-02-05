import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import InventoryActions from "./InventoryActions";
import AddItemModal from "../items/AddItemModal";
import { InventoryPagination } from "./InventoryPagination";
import { useEffect, useState, useContext } from "react";
import UsersContext from "../../context/UsersContext";
import dataFromApi from "../../api/axiosClient";
import "./Inventory.css"
import normalizeError from "../../api/normalizeError";
import backIcon from '../../assets/back.svg'
import { useNavigate } from "react-router-dom";
import ShowErrors from "../ShowErrors";
import ResumePDF from "./ResumePDF";
import InventorySearch from "./inventorySearch";
import Notification from "../Notification";

const InventoryPage = () => {
  const navigate = useNavigate();
  const {validUser} = useContext(UsersContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState([]); // datos tabla

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosPorPagina] = useState(30);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [errors, setErrors] = useState([]);
  const [showModalErrors, setShowModalErrors] = useState(false);
  const [message, setMessage] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  //buscar
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  //refresh inventario
  const [refreshInventory, setRefreshInventory] = useState(0);


  //Se obtinene las categorias del usuario al cargar el panel
  useEffect(()=> {
    if (!validUser || !validUser.id_usuario) return; // no hacer nada si no hay usuario válido
    
    //metodo para obtener las categorias
    const getCategories = async (id_usuario) => {
      try {
        const url = `inventario/usuario/${id_usuario}/categorias`; 
        const result = await dataFromApi("get", url, "", "");
        setCategories(result.data.categorias);
        /* if (result.data.categorias.length > 0) {
          setSelectedCategory(result.data.categorias[0].id_categoria);
        } else {
          setSelectedCategory(null);
        } */
      } catch (error) {
        if (!error.response) {
          return alert("No se pudo conectar con el servidor");
        }

        if(error.response.status === 400 || error.response.status === 403) return alert(error.response.data.message);

        alert(error.response.data.message);
      }
    }

    //llamamos al metodo
    getCategories(validUser.id_usuario);
  },[]);

  //obtener el inventario
  useEffect(() => {
    if (!validUser) return;

    const getInventory = async () => {
      const filtros = {
        id_usuario: validUser.id_usuario,
        id_categoria: selectedCategory,
        page: paginaActual,
        limit: datosPorPagina,
        search: search
      };
      const params = new URLSearchParams(filtros).toString();//Convertir el objeto en query params quedando de la siguiente forma por ejemplo
      //                                                       /inventario/usuario/categoria/articulos?id_usuario=5&id_categoria=3&page=1&limit=10

      try {
        const url = `inventario/usuario/categoria/articulos?${params}`;
        const result = await dataFromApi("get", url, "");

        setItems(result.data.items);
        setTotalPaginas(result.data.totalPages);
      } catch (error) {
        if (!error.response) {
          return alert("No se pudo conectar con el servidor.");
        }

        if(error.response.status === 400 ||
          error.response.status === 401 ||
          error.response.status === 403
        ) return alert(error.response.data.message);

        alert(error.response.data.message);
      }
    };

    const getAllInventory = async () => {
      const filtros = {
        id_usuario: validUser.id_usuario,
        page: paginaActual,
        limit: datosPorPagina,
        search: search
      };
      const params = new URLSearchParams(filtros).toString();//Convertir el objeto en query params quedando de la siguiente forma por ejemplo
      //                                                       /inventario/usuario/categoria/articulos?id_usuario=5&id_categoria=3&page=1&limit=10

      try {
        const url = `inventario/usuario/getAll/articulos?${params}`;
        const result = await dataFromApi("get", url, "");

        setItems(result.data.items);
        setTotalPaginas(result.data.totalPages);
      } catch (error) {
        if (!error.response) {
          return alert("No se pudo conectar con el servidor.");
        }

        if(error.response.status === 400 ||
          error.response.status === 403
        ) return alert(error.response.data.message);

        alert(error.response.data.message);
      }
    };

    if(selectedCategory === null) {
      getAllInventory();
      return;
    }
    getInventory();
  }, [validUser, selectedCategory, paginaActual, search, refreshInventory]);

  useEffect(() => {
    setPaginaActual(1);
  }, [search, selectedCategory]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleCategoryChange = (id_categoria) => {
    setSelectedCategory(id_categoria);
    setPaginaActual(1);
  };

  const handleAddArticle = async (form) => {
    try {
      const url = `inventario/usuario/categoria/articulo/agregar`;
      const result = await dataFromApi("post", url, "", form)
      if (result.status === 201) {
        setRefreshInventory(prev => prev + 1);
      };

      return result.status
    } catch (error) {
      console.log(error)
      if(!error.response) {
        return alert("No se pudo conectar con el servidor");
      }

      if (error.response.status === 400 || error.response.status === 409 || error.response.status === 404) {
        setErrors(error.response.data.error);
      } else {
        alert(error.response.data.message);
      }
    }
  }

  const handleUpdateArticle = async (form, id_articulo) => {
    try {
      const url = `inventario`;
      const endpoint = `/usuario/categoria/update/articulo/${id_articulo}`
      const result = await dataFromApi("patch", url, endpoint, form)
      if(result.status === 204) {
        setRefreshInventory(prev => prev + 1);
      }
      return result.status;
    } catch (error) {
      if(!error.response) {
        return alert("No se pudo conectar con el servidor");
      }

      if (error.response.status === 400 || error.response.status === 409 || error.response.status === 404) {
        setErrors(error.response.data.error);
      } else {
        alert(error.response.data.message);
      }
    }
  }

  const handleDeleteArticle = async (id_articulo) => {
      try {
        const url = `inventario/usuario/categoria/delete/articulo/${id_articulo}`;
        const result = await dataFromApi("delete", url, "");
        if(result.status === 204) {
          setRefreshInventory(prev => prev + 1);
          setMessage("Artículo eliminado");
          setOpenAlert(true);
        }
      } catch (error) {
        if(!error.response) {
          return alert("No se pudo conectar con el servidor");
        }

        if(error.response.status === 400) {
          return alert("El artículo no es válido")
        }

        if(error.response.status === 404) {
          return alert("El artículo no existe")
        }
        
        alert(error.response.data.message);
      }
  }

  const handleAddCategory = async (body) => {
    try {
      const url = `inventario/usuario/categoria/agregar`;
      const result = await dataFromApi("post", url, "", body);
      if (result.status === 201) {
        setCategories(prevCategories => [...prevCategories, result.data.newCategory]);
      }
      return result.status;
    } catch (error) {
      const err = normalizeError(error);
      if(err.type === "NETWORK") return alert(err.message)
      if(err.type === "SERVER") return err.message
      if(err.type === "VALIDATION" || err.type === "ER_DUP_ENTRY") return err.errors
    }
  }

  const handleDeleteCategory = async () => {
    if(!selectedCategory) return;

    try {
      const url = 'inventario'
      const endpoint = `/usuario/delete/categoria/${selectedCategory}`
      const result = await dataFromApi("post", url, endpoint);
      if(result.status === 200) {
        setMessage(result.data.message);
        setOpenAlert(true);
        const deletedId = result.data.deletedCategory; // es un número
        setCategories(prevCategories =>
          prevCategories.filter(category => category.id_categoria !== deletedId)
        );
        // Si la categoría eliminada estaba seleccionada, limpiamos selectedCategory
        if (selectedCategory === deletedId) {
          setSelectedCategory(null);
        }
      }
    } catch (error) {
      if(!error.response) {
        return alert("No se pudo conectar con el servidor");
      }
      
      if (error.response.status === 400 || error.response.status === 404) {
        alert(error.response.data.error);
      }
      return alert(error.response.data.message);
    }
  }

  const categoryMap = categories.reduce((map, cat) => {
    map[cat.nombre] = cat.id_categoria;
    return map;
  }, {});

  const handleImportFile = async(file) => {
    try {
      const url = `inventario/usuario/categoria/import/articulos`;
      const result = await dataFromApi("post", url, "", file);
      if (result.status === 201) {
        setMessage(result.data.message);
        setOpenAlert(true);
        setRefreshInventory(prev => prev + 1);
      }
    } catch (error) {
      setMessage(null);
      if(!error.response) {
        return alert("No se pudo conectar con el servidor");
      }

      if (error.response.status === 400 || error.response.status === 409) {
        setErrors(error.response)
        setShowModalErrors(true)
        return;
      }

      return alert(error.response.data);
    }
  } 
  
  const handleGetReport = async() => {
    if (!validUser) return;
    const id_usuario = validUser.id_usuario
    try {
      const url = `inventario`; 
      const endopoint = `/usuario/${id_usuario}/reporte?id_categoria=${selectedCategory}`
      const result = await dataFromApi("get", url, endopoint, "");
      console.log(result)
      ResumePDF(result.data.report)
    } catch (error) {
      console.log(error)
      if (!error.response) {
        return alert("No se pudo conectar con el servidor:(");
      }
      
      if (error.response.status === 400 || error.response.status === 404) {
        setErrors(error.response.data.error);
      }
      return alert(error.response.data.message);
    }
  }

  return (
    <div className="inventory-container">
      {modalOpen && <AddItemModal onClose={() => setModalOpen(false)} addItem={handleAddArticle} updateItem={handleUpdateArticle} selectedCategory={selectedCategory} backendErrors={errors} setBackendErrors={setErrors}/>}
      {showModalErrors && <ShowErrors response={errors} onClose={() => setShowModalErrors(false)} setErrors={setErrors}/>}
      {openAlert && <Notification
        isOpen={openAlert}
        title="Notificación"
        message={message}
        onClose={() => setOpenAlert(false)}
      />}

      <div className="inventory-header">
        <div>
          <div className="header">
            <button className="regresar" onClick={() => navigate("/dashboard")}><img src={backIcon} alt="Back"/></button>
            <h3>Registro de inventario</h3>
          </div>
          <p>{`${validUser.nombre} ${validUser.apellidos}`}</p>
        </div>

        <div className="inventory-header-content">
          <InventoryFilters categorias={categories} onCategoryChange={handleCategoryChange} addCategory={handleAddCategory} deleteCategory={handleDeleteCategory} selectedCategory={selectedCategory}/>
          <InventorySearch 
            value={searchInput}
            onChange={setSearchInput}>  
          </InventorySearch>
          <InventoryActions onAddItem={() => setModalOpen(true)} setItems={setItems} items={items} importFile={handleImportFile} categoryMap={categoryMap} getReport={handleGetReport}/>
        </div>
      </div>

      <InventoryTable datos={items} onAddItem={() => setModalOpen(true)} onDeleteItem={handleDeleteArticle}/>
      <InventoryPagination paginaActual={paginaActual} totalPaginas={totalPaginas} onChange={setPaginaActual}></InventoryPagination>
    </div>
  );
};

export default InventoryPage;