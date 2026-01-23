import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import Menu from "../Menu";
import Notification from "../Notification";

const InventoryActions = ({ onAddItem, importFile, categoryMap, getReport }) => {
  const fileInputRef = useRef();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([])

  const handleImportXLSX = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;

      // Leer archivo Excel
      const workbook = XLSX.read(data, { type: "binary" });

      let allImportedArticles = [];
      let categoriesFound = [];
      let categoriesNotFound = [];

      workbook.SheetNames.forEach((sheetName) => {
        // Obtener id_categoria a partir del nombre de la hoja
        const id_categoria = categoryMap[sheetName];
        if (!id_categoria) {
          categoriesNotFound.push(sheetName)
          /* alert(`La categoria "${sheetName}" no se existe para este usuario`);*/
          return; // omite hoja si categoría no existe 
        }

        categoriesFound.push(sheetName);

        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const articles = jsonData.map((articulo) => {
          const fechaAdq = excelValueToDate(articulo.fecha_adquisicion);
          const fechaAsig = excelValueToDate(articulo.fecha_asignacion);
          const fechaRev = excelValueToDate(articulo.fecha_ultima_revision);

          return {
            ...articulo,
            id_categoria,
            fecha_adquisicion: dateToISO(fechaAdq),
            fecha_asignacion: dateToISO(fechaAsig),
            fecha_ultima_revision: dateToISO(fechaRev)
          };
        });

        allImportedArticles = [...allImportedArticles, ...articles];
      });
      setData(allImportedArticles);

      // Resetear input para poder importar el mismo archivo otra vez
      fileInputRef.current.value = null;

      if (!categoriesFound.length) {
        setMessage("No se encontraron categorías válidas en el archivo.");
        setOpenAlert(true);
        return
      }

      let mensaje = "";
      // Mostrar al usuario las categorías importadas
      if(categoriesNotFound.length){
        mensaje += `Las siguientes categorías no se existe para este usuario: ${categoriesNotFound.map(cat => `"${cat}"`).join(", ")}.\n`;
      }
      if (categoriesFound.length) {
         mensaje += `Se importarán artículos de las siguientes categorías: ${categoriesFound.join(", ")}`;
      }
      setMessage(mensaje);
      setOpenConfirm(true);
      // Guardar artículos en el estado local y enviar al backend
      //setItems([...items, ...allImportedArticles]);
    };

    reader.readAsBinaryString(file);
  };

  const excelValueToDate = (value) => {
    if(value === "" || value === null || value === undefined ) return "";
    /* if (!value) return null; */

    if (typeof value === "number") {
      const utc_days = value - 25569;
      const utc_value = utc_days * 86400 * 1000;
      /* return new Date(utc_value); */
      const date = new Date(utc_value);

      if(!isNaN(date.getTime())) return date;

      return value;
    }

    if (typeof value === "string") {
      const date = new Date(value);

      if (!isNaN(date.getTime())) {
        return date;
      }

      // string inválido → devolver original
      return value;
    }

  return value;
    /* const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date; */
  };

  const dateToISO = (date) => {
    if (!(date instanceof Date)) return date;
    
    return date.toISOString().slice(0, 10);
  };

  return (
    <div className="inventory-actions">
      {openConfirm && <Notification
        isOpen={openConfirm}
        title="Confirmar acción"
        message={message}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          importFile(data);
          setData([]);
          setOpenConfirm(false);
        }}
        confirmText="Importar"
      />}

      {openAlert && <Notification
        isOpen={openAlert}
        title="Notificación"
        message={message}
        onClose={() => setOpenAlert(false)}
      />}

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleImportXLSX}
      />
      {/* <button className="button-actions" onClick={() => fileInputRef.current.click()}>Importar archivo</button> */}
      <Menu 
        className="menu-actions" 
        title={"Importar archivo"} 
        items={[{name: "Importar Excel", action: () => fileInputRef.current.click()}
        ]}/>
      <button className="button-actions" onClick={onAddItem}>+ Agregar Artículo</button>
      <button className="button-actions" onClick={getReport}>📊 Reporte</button>
    </div>
  );
};

export default InventoryActions;
