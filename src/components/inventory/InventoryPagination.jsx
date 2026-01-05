export const InventoryPagination = ({paginaActual, totalPaginas, onChange}) => {
  const pages = [];
  for (let i = 1; i <= totalPaginas; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        disabled={paginaActual === 1 || totalPaginas === 0}
        onClick={() => onChange(paginaActual - 1)}
      >
        {"<"}
      </button>

      {pages.map(p => (
        <button
          key={p}
          className={p === paginaActual ? "active" : ""}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        disabled={paginaActual === totalPaginas || totalPaginas === 0}
        onClick={() => onChange(paginaActual + 1)}
      >
        {">"}
      </button>
    </div>
  );
}