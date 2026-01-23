import "./styles/ShowErrors.css"

const ErrorsModal = ({ response, setErrors, onClose }) => {
  const errors = response.data

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-custom">
        <div className="modal-header">
          <h3>❌ Error al importar</h3>
          <button className="close-modal" onClick={() => {
            onClose();
            setErrors([]);
            }}>✖</button>
        </div>

        <div className="modal-body">
            {response.status === 400 && (errors.map((item, index) => (
            <div key={index} className="row-errors">
              <h4>Fila {item.row}</h4>

              <ul>
                {item.errors.map((err, i) => (
                  <li key={i}>
                    <strong>{err.field}:</strong> {err.message}
                  </li>
                ))}
              </ul>
              <hr />
            </div>
          )))}

          {response.status === 409 && <div className="row-errors">
            {errors.error.map((err, i) => (
              <ul>
                <li key={i}>
                  <h4>Fila {err.row}</h4>
                  <strong>Registro duplicado:</strong> {err.no_inventario}
                </li>
                <hr />
              </ul>
            ))}
          </div> }

          
        </div>
      </div>
    </div>
  );
};

export default ErrorsModal;
