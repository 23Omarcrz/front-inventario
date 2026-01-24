import "./Inventory.css";

const InventorySearch = ({ value, onChange }) => {
  return (
    <div className="inventory-search">
      <input
        type="text"
        placeholder="Buscar artículo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InventorySearch;
