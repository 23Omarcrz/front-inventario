import { useState, useEffect, useRef } from "react";
import './styles/Menu.css'; // tu CSS

const Menu = ({ title, items = [], onClickItem }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null); // referencia al contenedor del menú

  // Función para cerrar menú si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-archivo" ref={menuRef}>
        <button className="btn-main" onClick={() => setOpen(!open)}>
            {`${title} ${open ? "▴" : "▾"}`}
        </button>

        {open && (
            <div className="desp-menu">
                {items.map((item, index) => 
                    <button  className="desp-item" 
                        key={index}
                        onClick={() => {
                            item.action();
                            setOpen(false);
                        }}>{item.name}
                    </button>)}
            </div>
        )}
    </div>
  );
};

export default Menu;
