import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportePDF = (data) => {
  const doc = new jsPDF();

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
      a.marca,
      a.descripcion,
      a.fabricante,
      a.observaciones,
      a.valor ? `$${a.valor}` : "",
      a.fecha_adquisicion,
      a.fecha_asignacion,
      a.ubicacion,
      a.resguardatario,
      a.no_interno_DCC,
      a.fecha_ultima_revision,
      a.no_oficio_traspaso,
      a.estatus,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [
        [
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
        ],
      ],
      body: tableData,
      styles: { fontSize: 5 },
      headStyles: { fillColor: [41, 128, 185], halign: "center" },
      margin: { left: 14, right: 14 },
      theme: "grid",
    });

    // Actualizar posición Y
    currentY = doc.lastAutoTable.finalY + 10;
  });

  // ====== DESCARGAR ======
  doc.save(`reporte_inventario_${data.usuario}.pdf`);
};

export default ReportePDF;
