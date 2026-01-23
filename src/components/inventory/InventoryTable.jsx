import deleteIcon from '../../assets/papelera.svg'
import editIcon from '../../assets/editar.svg'
import { useContext, useState } from 'react';
import UsersContext from '../../context/UsersContext';
import { useModal } from '../../hooks/useModal';
import Notification from '../Notification';

const InventoryTable = ({datos, onAddItem, onDeleteItem}) => {
  const {setEditData} = useContext(UsersContext);
  const [itemSelected, setItemSelected] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <div>
      {openConfirm && <Notification
        isOpen={openConfirm}
        title="⚠️ ¿Seguro que desea realizar la siguiente acción?"
        message="El artículo será eliminado permanentemente"
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          onDeleteItem(itemSelected);
          setOpenConfirm(false);
        }}
        confirmText="Eliminar"
      />}      

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
                    <td><div className='clamp'>{el.no_inventario}</div></td>
                    <td><div className='clamp'>{el.usuario}</div></td>
                    <td><div className='clamp'>{el.no_serie}</div></td>
                    <td><div className='clamp'>{el.marca}</div></td>
                    <td><div className='clamp'>{el.descripcion}</div></td>
                    <td><div className='clamp'>{el.fabricante}</div></td>
                    <td><div className='clamp'>{el.observaciones}</div></td>
                    <td><div className='clamp'>${el.valor}</div></td>
                    <td><div className='clamp'>{el.fecha_adquisicion}</div></td>
                    <td><div className='clamp'>{el.fecha_asignacion}</div></td>
                    <td><div className='clamp'>{el.ubicacion}</div></td> 
                    <td><div className='clamp'>{el.resguardatario}</div></td>
                    <td><div className='clamp'>{el.no_interno_DCC}</div></td>
                    <td><div className='clamp'>{el.fecha_ultima_revision}</div></td>
                    <td><div className='clamp'>{el.no_oficio_traspaso}</div></td>
                    <td><div className='clamp'>
                      <div className={el.estatus && `estado ${el.estatus.toLowerCase()}`}>
                        {el.estatus}
                      </div>
                    </div>
                    </td>
                    <td className="acciones">
                      <div className='clamp'>
                        <div className="acciones-buttons">
                          <button className="button-table" onClick={() => {
                            setEditData(
                              Object.fromEntries(
                                Object.entries(el).map(([key, value]) => [
                                  key,
                                  value === null ? "" : value
                                ])
                              ));
                            onAddItem();
                          }}><img src={editIcon} alt="Editar" width={15} /></button>
                          <button className="button-table" onClick={() => {
                            setItemSelected(el.id_articulo);
                            setOpenConfirm(true);
                            }}><img src={deleteIcon} alt="Eliminar" width={15} /></button>
                        </div>
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
