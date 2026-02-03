import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportePDF = (data) => {
  const doc = new jsPDF({
    orientation: "landscape", // 👈 horizontal
    unit: "mm",
    format: "a4"
  });


  // ====== TÍTULO ======
  doc.setFontSize(14);
  doc.text(`Reporte de Inventario - Usuario: ${data.usuario}`, 14, 20);
  doc.setFontSize(10);
  doc.text(`Tipo de reporte: ${data.tipo_reporte.replace("_", " ")}`, 14, 28);

  let currentY = 35;

  // ====== RECORRER CATEGORÍAS ======
  data.categorias.forEach((cat, idx) => {
    // Subtítulo de la categoría
    doc.setFontSize(12);
    doc.text(`Categoría: ${cat.categoria}`, 14, currentY);
    currentY += 6;

    // ====== TABLA DE ARTÍCULOS ======
    const tableData = cat.articulos.map((a) => [
      a.no_inventario,
      a.no_serie,
      cleanText(a.marca),
      cleanText(a.descripcion),
      cleanText(a.fabricante),
      cleanText(a.observaciones),
      formatCurrency(a.valor),
      a.fecha_adquisicion,
      a.fecha_asignacion,
      cleanText(a.ubicacion),
      cleanText(a.resguardatario),
      cleanText(a.no_interno_DCC),
      a.fecha_ultima_revision,
      cleanText(a.no_oficio_traspaso),
      a.estatus,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [[
        "No. Inventario",
        "No. Serie",
        "Marca",
        "Descripción",
        "Fabricante",
        "Observaciones",
        "Valor",
        "Fecha Adq.",
        "Fecha Asig.",
        "Ubicación",
        "Resguardatario",
        "No. DCC",
        "Fecha Rev.",
        "No. Oficio Traspaso",
        "Estatus",
      ]],
      body: tableData,
      styles: {
        fontSize: 5,
        cellPadding: 1,
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 18 },
        2: { cellWidth: 12 },
        3: { cellWidth: 30 }, // Descripción
        4: { cellWidth: 22 },
        5: { cellWidth: 35 }, // Observaciones (controlada)
        6: { cellWidth: 12, halign: "right" },
        7: { cellWidth: 14 },
        8: { cellWidth: 14 },
        9: { cellWidth: 18 },
        10:{ cellWidth: 20 },
        11:{ cellWidth: 14 },
        12:{ cellWidth: 14 },
        13:{ cellWidth: 18 },
        14:{ cellWidth: 12 },
      },
      headStyles: {
        fillColor: [41, 128, 185],
        halign: "center",
      },
      margin: { left: 14, right: 14 },
      theme: "grid",
    });


    // Actualizar posición Y
    currentY = doc.lastAutoTable.finalY + 10;
  });

  // ====== DESCARGAR ======
  doc.save(`reporte_inventario_${data.usuario}.pdf`);
};

const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(/\r?\n|\r/g, " ") // quitar enters
    .replace(/\s+/g, " ")     // colapsar espacios
    .trim();
};

const formatCurrency = (value) => {
  if (!value) return "";
  return `$${Number(value).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


export default ReportePDF;
