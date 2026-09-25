import React, { useEffect, useMemo, useState } from "react";
import "./Inventory.css";

const STORAGE_KEY = "clinic_inventory_items";
const HISTORY_KEY = "clinic_inventory_history";

const defaultItems = [
  {
    id: "INV-0001",
    name: "Therapy Band",
    category: "Therapy Equipment",
    unit: "Piece",
    openingStock: 10,
    stock: 10,
    minimumStock: 3,
  },
  {
    id: "INV-0002",
    name: "Hot Pack",
    category: "Therapy Equipment",
    unit: "Piece",
    openingStock: 8,
    stock: 8,
    minimumStock: 2,
  },
  {
    id: "INV-0003",
    name: "Cold Pack",
    category: "Therapy Equipment",
    unit: "Piece",
    openingStock: 8,
    stock: 8,
    minimumStock: 2,
  },
  {
    id: "INV-0004",
    name: "Therapy Gel",
    category: "Consumable",
    unit: "Bottle",
    openingStock: 15,
    stock: 15,
    minimumStock: 5,
  },
];

function Inventory() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const [stockAction, setStockAction] = useState("IN");

  const [search, setSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyType, setHistoryType] = useState("ALL");
  const [historyDate, setHistoryDate] = useState("");

  const [selectedItemId, setSelectedItemId] = useState("");

  const [itemForm, setItemForm] = useState({
    name: "",
    category: "",
    unit: "Piece",
    openingStock: "",
    minimumStock: "",
  });

  const [stockForm, setStockForm] = useState({
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    person: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);

    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(defaultItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.category.toLowerCase().includes(value) ||
        item.id.toLowerCase().includes(value)
    );
  }, [items, search]);

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      const searchValue = historySearch.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        entry.itemName.toLowerCase().includes(searchValue) ||
        entry.person.toLowerCase().includes(searchValue) ||
        entry.reason.toLowerCase().includes(searchValue);

      const matchesType =
        historyType === "ALL" || entry.type === historyType;

      const matchesDate =
        !historyDate || entry.date === historyDate;

      return matchesSearch && matchesType && matchesDate;
    });
  }, [history, historySearch, historyType, historyDate]);

  const totalItems = items.length;

  const totalStock = items.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );

  const lowStockItems = items.filter(
    (item) => Number(item.stock) <= Number(item.minimumStock)
  );

  const totalStockIn = history
    .filter((entry) => entry.type === "IN")
    .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);

  const totalStockOut = history
    .filter((entry) => entry.type === "OUT")
    .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);

  const generateItemId = () => {
    const numbers = items
      .map((item) => Number(item.id.replace("INV-", "")))
      .filter((number) => !Number.isNaN(number));

    const next = numbers.length ? Math.max(...numbers) + 1 : 1;

    return `INV-${String(next).padStart(4, "0")}`;
  };

  const openStockModal = (itemId, action) => {
    setSelectedItemId(itemId);
    setStockAction(action);

    setStockForm({
      quantity: "",
      date: new Date().toISOString().split("T")[0],
      person: "",
      reason: "",
      notes: "",
    });

    setShowStockModal(true);
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    const name = itemForm.name.trim();

    if (!name) {
      alert("Item name डालिए.");
      return;
    }

    const openingStock = Number(itemForm.openingStock);
    const minimumStock = Number(itemForm.minimumStock);

    if (Number.isNaN(openingStock) || openingStock < 0) {
      alert("Opening stock सही डालिए.");
      return;
    }

    if (Number.isNaN(minimumStock) || minimumStock < 0) {
      alert("Minimum stock सही डालिए.");
      return;
    }

    const duplicate = items.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      alert("यह item पहले से inventory में मौजूद है.");
      return;
    }

    const newItem = {
      id: generateItemId(),
      name,
      category: itemForm.category.trim() || "General",
      unit: itemForm.unit,
      openingStock,
      stock: openingStock,
      minimumStock,
    };

    setItems((prev) => [...prev, newItem]);

    if (openingStock > 0) {
      setHistory((prev) => [
        {
          id: Date.now(),
          itemId: newItem.id,
          itemName: newItem.name,
          type: "IN",
          quantity: openingStock,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString(),
          person: "Admin",
          reason: "Opening Stock",
          notes: "Initial inventory stock",
        },
        ...prev,
      ]);
    }

    setItemForm({
      name: "",
      category: "",
      unit: "Piece",
      openingStock: "",
      minimumStock: "",
    });

    setShowAddItem(false);

    alert("Inventory item successfully added.");
  };

  const handleStockUpdate = (e) => {
    e.preventDefault();

    const quantity = Number(stockForm.quantity);

    if (!selectedItemId) {
      alert("Item select कीजिए.");
      return;
    }

    if (Number.isNaN(quantity) || quantity <= 0) {
      alert("Valid quantity डालिए.");
      return;
    }

    if (!stockForm.date) {
      alert("Date select कीजिए.");
      return;
    }

    if (!stockForm.person.trim()) {
      alert("किसने stock handle किया, उसका नाम डालिए.");
      return;
    }

    if (!stockForm.reason.trim()) {
      alert("Reason डालना जरूरी है.");
      return;
    }

    const selectedItem = items.find(
      (item) => item.id === selectedItemId
    );

    if (!selectedItem) {
      alert("Item नहीं मिला.");
      return;
    }

    if (
      stockAction === "OUT" &&
      Number(selectedItem.stock) < quantity
    ) {
      alert(
        `इतना stock available नहीं है.\nAvailable: ${selectedItem.stock} ${selectedItem.unit}`
      );
      return;
    }

    const newStock =
      stockAction === "IN"
        ? Number(selectedItem.stock) + quantity
        : Number(selectedItem.stock) - quantity;

    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              stock: newStock,
            }
          : item
      )
    );

    const newHistory = {
      id: Date.now(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      type: stockAction,
      quantity,
      date: stockForm.date,
      time: new Date().toLocaleTimeString(),
      person: stockForm.person.trim(),
      reason: stockForm.reason.trim(),
      notes: stockForm.notes.trim(),
    };

    setHistory((prev) => [newHistory, ...prev]);

    setShowStockModal(false);

    alert(
      stockAction === "IN"
        ? "Stock successfully added."
        : "Stock successfully removed."
    );
  };

  const deleteItem = (itemId) => {
    const item = items.find((item) => item.id === itemId);

    if (!item) return;

    const confirmDelete = window.confirm(
      `"${item.name}" को inventory से delete करना है?`
    );

    if (!confirmDelete) return;

    setItems((prev) => prev.filter((item) => item.id !== itemId));

    setHistory((prev) =>
      prev.filter((entry) => entry.itemId !== itemId)
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <div className="inventory-page">
      <div className="inventory-container">

        {/* HEADER */}
        <div className="inventory-header">
          <div>
            <span className="inventory-badge">
              INVENTORY MANAGEMENT
            </span>

            <h1>Clinic Inventory</h1>

            <p>
              Stock, purchases, usage और complete inventory history
              एक जगह manage करें.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => setShowAddItem(true)}
          >
            + Add New Item
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="inventory-summary">

          <div className="summary-card">
            <div className="summary-icon">📦</div>
            <div>
              <span>Total Items</span>
              <strong>{totalItems}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🔢</div>
            <div>
              <span>Total Stock</span>
              <strong>{totalStock}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">➕</div>
            <div>
              <span>Stock In</span>
              <strong>{totalStockIn}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">➖</div>
            <div>
              <span>Stock Out</span>
              <strong>{totalStockOut}</strong>
            </div>
          </div>

          <div className="summary-card warning-summary">
            <div className="summary-icon">⚠️</div>
            <div>
              <span>Low Stock</span>
              <strong>{lowStockItems.length}</strong>
            </div>
          </div>

        </div>

        {/* LOW STOCK */}
        {lowStockItems.length > 0 && (
          <div className="low-stock-alert">
            <div>
              <strong>⚠️ Low Stock Alert</strong>
              <p>
                नीचे दिए items का stock minimum level पर या उससे कम है.
              </p>
            </div>

            <div className="low-stock-list">
              {lowStockItems.map((item) => (
                <span key={item.id}>
                  {item.name}: {item.stock} {item.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CURRENT INVENTORY */}
        <section className="inventory-section">

          <div className="section-heading">
            <div>
              <h2>Current Inventory</h2>
              <p>अभी clinic में available stock.</p>
            </div>

            <input
              type="text"
              className="inventory-search"
              placeholder="Search item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Current Stock</th>
                  <th>Minimum</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      Inventory item नहीं मिला.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isLow =
                      Number(item.stock) <=
                      Number(item.minimumStock);

                    return (
                      <tr key={item.id}>

                        <td>
                          <span className="item-id">
                            {item.id}
                          </span>
                        </td>

                        <td>
                          <strong>{item.name}</strong>
                        </td>

                        <td>{item.category}</td>

                        <td>{item.unit}</td>

                        <td>
                          <strong
                            className={
                              isLow
                                ? "stock-number low"
                                : "stock-number"
                            }
                          >
                            {item.stock}
                          </strong>
                        </td>

                        <td>{item.minimumStock}</td>

                        <td>
                          {isLow ? (
                            <span className="status-badge low">
                              Low Stock
                            </span>
                          ) : (
                            <span className="status-badge good">
                              Available
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="table-actions">

                            <button
                              className="stock-in-btn"
                              onClick={() =>
                                openStockModal(item.id, "IN")
                              }
                            >
                              + Stock
                            </button>

                            <button
                              className="stock-out-btn"
                              onClick={() =>
                                openStockModal(item.id, "OUT")
                              }
                            >
                              − Out
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() => deleteItem(item.id)}
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </section>

        {/* STOCK HISTORY */}
        <section className="inventory-section">

          <div className="section-heading history-heading">
            <div>
              <h2>Stock Movement History</h2>
              <p>
                किस तारीख को क्या आया, क्या निकला और किसने निकाला.
              </p>
            </div>
          </div>

          <div className="history-filters">

            <input
              type="text"
              placeholder="Search item / person / reason..."
              value={historySearch}
              onChange={(e) =>
                setHistorySearch(e.target.value)
              }
            />

            <select
              value={historyType}
              onChange={(e) => setHistoryType(e.target.value)}
            >
              <option value="ALL">All Movements</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>

            <input
              type="date"
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
            />

            <button
              className="clear-filter-btn"
              onClick={() => {
                setHistorySearch("");
                setHistoryType("ALL");
                setHistoryDate("");
              }}
            >
              Clear
            </button>

          </div>

          <div className="table-wrapper">
            <table className="inventory-table history-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Item</th>
                  <th>Movement</th>
                  <th>Quantity</th>
                  <th>Person</th>
                  <th>Reason</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>

                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      कोई stock history नहीं मिली.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((entry) => (
                    <tr key={entry.id}>

                      <td>{formatDate(entry.date)}</td>

                      <td>{entry.time}</td>

                      <td>
                        <strong>{entry.itemName}</strong>
                      </td>

                      <td>
                        {entry.type === "IN" ? (
                          <span className="movement-badge in">
                            + Stock In
                          </span>
                        ) : (
                          <span className="movement-badge out">
                            − Stock Out
                          </span>
                        )}
                      </td>

                      <td>
                        <strong>{entry.quantity}</strong>
                      </td>

                      <td>{entry.person}</td>

                      <td>{entry.reason}</td>

                      <td>
                        {entry.notes || "-"}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>
          </div>

        </section>

      </div>

      {/* ADD ITEM MODAL */}
      {showAddItem && (
        <div
          className="inventory-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddItem(false);
            }
          }}
        >
          <div className="inventory-modal">

            <div className="modal-header">
              <div>
                <h2>Add Inventory Item</h2>
                <p>नया inventory item add करें.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowAddItem(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddItem}>

              <div className="form-grid">

                <div className="form-group full">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Therapy Band"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Consumable"
                    value={itemForm.category}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        category: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={itemForm.unit}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        unit: e.target.value,
                      })
                    }
                  >
                    <option>Piece</option>
                    <option>Box</option>
                    <option>Packet</option>
                    <option>Bottle</option>
                    <option>Tube</option>
                    <option>Kg</option>
                    <option>Liter</option>
                    <option>Set</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Opening Stock *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={itemForm.openingStock}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        openingStock: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Stock Alert *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    value={itemForm.minimumStock}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        minimumStock: e.target.value,
                      })
                    }
                  />
                </div>

              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowAddItem(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Save Item
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* STOCK IN / OUT MODAL */}
      {showStockModal && (
        <div
          className="inventory-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowStockModal(false);
            }
          }}
        >
          <div className="inventory-modal">

            <div className="modal-header">
              <div>
                <h2>
                  {stockAction === "IN"
                    ? "Add Stock"
                    : "Stock Out"}
                </h2>

                <p>
                  {items.find(
                    (item) => item.id === selectedItemId
                  )?.name}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowStockModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleStockUpdate}>

              <div className="stock-current-box">
                <span>Current Available Stock</span>

                <strong>
                  {
                    items.find(
                      (item) => item.id === selectedItemId
                    )?.stock
                  }{" "}
                  {
                    items.find(
                      (item) => item.id === selectedItemId
                    )?.unit
                  }
                </strong>
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={stockForm.quantity}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={stockForm.date}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group full">
                  <label>
                    {stockAction === "OUT"
                      ? "किसने निकाला? *"
                      : "किसने stock add किया? *"}
                  </label>

                  <input
                    type="text"
                    placeholder="Employee / Admin name"
                    value={stockForm.person}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        person: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group full">
                  <label>
                    {stockAction === "OUT"
                      ? "किस काम के लिए निकाला? *"
                      : "Stock आने का Reason *"}
                  </label>

                  <input
                    type="text"
                    placeholder={
                      stockAction === "OUT"
                        ? "e.g. Patient treatment"
                        : "e.g. New purchase"
                    }
                    value={stockForm.reason}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        reason: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group full">
                  <label>Notes</label>

                  <textarea
                    rows="3"
                    placeholder="Additional details..."
                    value={stockForm.notes}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowStockModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={
                    stockAction === "IN"
                      ? "stock-submit-in"
                      : "stock-submit-out"
                  }
                >
                  {stockAction === "IN"
                    ? "+ Add Stock"
                    : "− Remove Stock"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Inventory;