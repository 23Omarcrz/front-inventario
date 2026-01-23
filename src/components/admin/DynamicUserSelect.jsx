import { useState, useEffect, useRef} from "react";

export default function DynamicUserSelect({ users, onSelect, onDeleteUser }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [selectedUser, setSelectedUser] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedUser(null); 
    setQuery(value);

    if (value.trim() === "") {
      setFiltered([]);
      setOpen(false);
      return;
    }

    // Esto filtra por nombre, email o ID
    const results = users.filter((u) =>
      /* u.name.toLowerCase().includes(value.toLowerCase()) ||
      u.email.toLowerCase().includes(value.toLowerCase()) ||
      u.id.toString().includes(value) */
      u.nombre.toLowerCase().includes(value.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(results);
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //que los campos no esten vacios
    if (!query.trim()) {
      setError("Selecciona un usuario");
      return;
    }

    if (!selectedUser) {
      setError("El usuario no existe");
      return;
    }

    onSelect(selectedUser);        // Devuelve el usuario al padre
    setError(null);
    handleReset();
  };

  const handleSelect = (user) => {
    setQuery(`${user.nombre} ${user.apellidos}`);   // Muestra el nombre en el input
    setOpen(false);        // Cierra la lista
    setSelectedUser(user);
  };

  const handleReset = () => {
    setQuery("");
  };

  return (
    <div className="dynamic-select" ref={ref}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Seleccionar usuario..."
          value={query}
          onChange={handleChange}
          className="select-input"
        />
        <p className="error-select-user">{error}</p>
        <button type="submit" className="admin-button">Aceptar</button>
      </form>

      {open && filtered.length > 0 && (
        <ul className="dropdown">
          {filtered.map((user) => (
            <li
              key={user.id_usuario}
              onClick={() => handleSelect(user)}
              className="dropdown-item"
            >
              <strong>{`${user.nombre} ${user.apellidos}`}</strong>
              <span>{user.area}</span>
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && (
        <div className="dropdown no-results">
          No hay resultados
        </div>
      )}
    </div>
  );
}
