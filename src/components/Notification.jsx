import "./styles/notification.css";

export default function Notification({
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
}) {

  return (
    <div className="notification-backdrop">
      <div className="notification">
        {title && <h3>{title}</h3>}
        <p>{message}</p>

        <div className="notification-actions">
          {onConfirm ? (
            <>
              <button className="btn secondary" onClick={onClose}>
                {cancelText}
              </button>
              <button className="btn primary" onClick={onConfirm}>
                {confirmText}
              </button>
            </>
          ) : (
            <button className="btn primary" onClick={onClose}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
