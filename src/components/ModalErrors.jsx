import "./styles/modal.css"
import cerrarIcon from '../assets/cerrar.svg'

const Modal = ({children, isOpen, closeModal}) => {
    const handleModalContainerClick = e => e.stopPropagation();

    return (
        <article className={`modal ${isOpen && "is-open"}`} onClick={closeModal}>
            <div className="modal-container" onClick={handleModalContainerClick}>
                <button className="modal-close" onClick={closeModal}><img src={cerrarIcon} alt="" /></button>
                {children}
            </div>
        </article>
    )
}

export default Modal;