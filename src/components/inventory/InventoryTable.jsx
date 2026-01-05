import deleteIcon from '../../assets/papelera.svg'
import editIcon from '../../assets/editar.svg'

const InventoryTable = ({datos, onAddItem, onDeleteItem}) => {
  //estos se mandan al backend

  return (
    <div>
      <div className="inventory-table">
        <div className="inventory-table-scroll">
          
          <table>
            <thead>
              <tr>
                <th>No. Inventario</th>
                <th>Usuario</th>
                <th>No. Serie</th>
                <th>Marca</th>
                <th>Descripción</th>
                <th>Fabricante</th>
                <th>Observaciones</th>
                <th>Valor</th>
                <th>Fecha Adquisición</th>
                <th>Fecha Asignación</th>
                <th>Ubicación</th>
                <th>Resguardatario</th>
                <th>No. DCC</th>
                <th>Fecha Revisión</th>
                <th>No. Oficio Traspaso</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {/* Aquí se llena con datos dinámicos */}
              {datos.length === 0 ? (<tr><td colSpan="17">Sin datos</td></tr>) : (datos.map((el, index) => {
                return(
                  <tr key={index}>
                    <td>{el.no_inventario}</td>
                    <td>{el.usuario}</td>
                    <td>{el.no_serie}</td>
                    <td>{el.marca}</td>
                    <td>{el.descripcion}</td>
                    <td>{el.fabricante}</td>
                    <td>{el.observaciones}</td>
                    <td>${el.valor}</td>
                    <td>{el.fecha_adquisicion}</td>
                    <td>{el.fecha_asignacion}</td>
                    <td>{el.ubicacion}</td> 
                    <td>{el.resguardatario}</td>
                    <td>{el.no_interno_DCC}</td>
                    <td>{el.fecha_ultima_revision}</td>
                    <td>{el.no_oficio_traspaso}</td>
                    <td>
                      <div className={el.estatus && `estado ${el.estatus.toLowerCase()}`}>
                        {el.estatus}
                      </div>
                    </td>
                    <td className="acciones">
                      <div className="acciones-buttons">
                        <button onClick={onAddItem}><img src={editIcon} alt="Editar" width={15} /></button>
                        <button onClick={() => onDeleteItem(el.id_articulo)}><img src={deleteIcon} alt="Eliminar" width={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              }))}
            </tbody>
          </table>

        </div>
      </div>
      
    </div>
  );
};

export default InventoryTable;
