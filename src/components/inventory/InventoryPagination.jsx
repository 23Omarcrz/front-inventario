export const InventoryPagination = ({paginaActual, totalPaginas, onChange}) => {
  const pages = [];
  for (let i = 1; i <= totalPaginas; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className={(paginaActual === 1 || totalPaginas === 0) ? "button-pagination" : "button-pagination enable"}
        disabled={paginaActual === 1 || totalPaginas === 0}
        onClick={() => onChange(paginaActual - 1)}
      >
        {"<"}
      </button>

      {pages.map(p => (
        <button
          key={p}
          className={p === paginaActual ? "button-pagination enable active" : "button-pagination enable"}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className={paginaActual === totalPaginas || totalPaginas === 0 ? "button-pagination" : "button-pagination enable"}
        disabled={paginaActual === totalPaginas || totalPaginas === 0}
        onClick={() => onChange(paginaActual + 1)}
      >
        {">"}
      </button>
    </div>
  );
}