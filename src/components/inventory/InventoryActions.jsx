import { useRef } from "react";
import * as XLSX from "xlsx";

const InventoryActions = ({onAddItem, setItems, items, importFile, selectedCategory}) => {
  const fileInputRef = useRef();

  const id_categoria = selectedCategory; 

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;

      // Lee el archivo Excel
      const workbook = XLSX.read(data, { type: "binary" });

      // Toma la primera hoja
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convierte a JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      /*
        "Convierte cada fila del Excel en un objeto
        con las claves correspondientes, y las agrega
        a la base de datos actual en este caso solo a un objeto"
      */  
      const articulosImpotados = jsonData.map((articulo) => {
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
      })
      setItems([...items, ...articulosImpotados]);
      importFile(articulosImpotados);
      console.log(articulosImpotados)
      alert("Datos importados correctamente.");
    };
    

    reader.readAsBinaryString(file);
  };

  const excelValueToDate = (value) => {
    if (!value) return null;

    // Fecha real de Excel (serial)
    if (typeof value === "number") {
      const utc_days = value - 25569;
      const utc_value = utc_days * 86400 * 1000;
      return new Date(utc_value);
    }

    // String → intentar parsear
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;

    return date;
  };

  const dateToISO = (date) => {
  if (!date) return null;
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
};



  return (
    <div className="inventory-actions">
      {/* Input oculto */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileImport}
      />
      <button onClick={() => fileInputRef.current.click()}>Imprtar archivo</button>
      <button onClick={onAddItem}>+ Agregar Artículo</button>
      <button>📊 Reportes</button>
    </div>
  );
};

export default InventoryActions;
