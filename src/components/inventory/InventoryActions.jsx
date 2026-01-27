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
            valor: normalizeValor(articulo.valor),
            fecha_adquisicion: dateToISO(fechaAdq),
            fecha_asignacion: dateToISO(fechaAsig),
            fecha_ultima_revision: dateToISO(fechaRev)
          };
        });

        allImportedArticles = [...allImportedArticles, ...articles];
      });
      setData(allImportedArticles);
      console.log(allImportedArticles);

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
    if (value === "" || value === null || value === undefined) return null;

    // Si es número (Excel serial date)
    if (typeof value === "number") {
      const utc_days = value - 25569;
      const utc_value = utc_days * 86400 * 1000;
      const date = new Date(utc_value);
      return isNaN(date.getTime()) ? null : date;
    }

    // Si es string
    if (typeof value === "string") {
      // Reemplazar "/" por "-" si viene DD/MM/YYYY
      let normalized = value.replace(/\//g, "-").trim();

      // Detectar formato DD-MM-YYYY y convertir a YYYY-MM-DD
      const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
      const match = normalized.match(ddmmyyyy);
      if (match) {
        normalized = `${match[3]}-${match[2]}-${match[1]}`;
      }

      const date = new Date(normalized);
      return isNaN(date.getTime()) ? value : date; // **Si es inválido, devolvemos el texto tal cual**
    }

    // Cualquier otro tipo → inválido → devolver tal cual
    return value;
  };

  const dateToISO = (date) => {
    if (!(date instanceof Date)) return date; // si es inválido, devolvemos tal cual
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };


  const normalizeValor = (value) => {
    if (value === "" || value === null || value === undefined) {
      // Celda vacía → enviar null
      return null;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? Number(value.toFixed(2)) : value;
    }

    if (typeof value === "string") {
       // 1. Quitar espacios
      let cleaned = value.replace(/\s/g, "");

      // 2. Quitar símbolos de moneda
      cleaned = cleaned.replace(/\$/g, "");

      // 3. Quitar separadores de miles (coma)
      cleaned = cleaned.replace(/,/g, "");

      // 4. Reemplazar coma decimal por punto (en caso de que usen mal la notación)
      cleaned = cleaned.replace(/,/g, ".");

      // Si después de limpiar quedó vacío → devolver null
      if (cleaned === "") return null;

      const n = Number(cleaned);
      if (Number.isFinite(n)) {
        return Number(n.toFixed(2)); // número válido
      }

      // Texto no numérico → enviarlo tal cual para que el backend valide
      return value;
    }

    // Otros tipos raros → enviar tal cual
    return value;
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
