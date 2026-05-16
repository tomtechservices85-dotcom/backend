import { useEffect, useState } from "react";
import Login from "./components/Login";


function App() {
  return <Login />;
}

export default function App() {
  const [products, setProducts] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    comment: "",
    imageUrl: ""
  });

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then(r => r.json())
      .then(setProducts);
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: "", price: "", comment: "", imageUrl: "" });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      comment: p.comment || "",
      imageUrl: p.imageUrl || ""
    });
    setModalOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      price: Number(form.price)
    };

    if (editId) {
      const res = await fetch(`http://localhost:3001/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const updated = await res.json();
      setProducts(products.map(p => p.id === editId ? updated : p));
    } else {
      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const created = await res.json();
      setProducts([...products, created]);
    }

    setModalOpen(false);
  };

  const remove = async (id) => {
    await fetch(`http://localhost:3001/products/${id}`, {
      method: "DELETE"
    });

    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Dashboard</h1>

        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          + Ajouter
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-3">

            {p.imageUrl && (
              <img src={p.imageUrl} className="rounded-xl h-40 w-full object-cover" />
            )}

            <h2 className="font-bold mt-2">{p.name}</h2>
            <p className="text-green-600">{p.price} €</p>

            {p.comment && (
              <p className="text-gray-500 text-sm">{p.comment}</p>
            )}

            <div className="flex justify-between mt-3">
              <button
                onClick={() => openEdit(p)}
                className="text-yellow-500"
              >
                ✏️
              </button>

              <button
                onClick={() => remove(p.id)}
                className="text-red-500"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          
          <div className="bg-white p-5 rounded-xl w-96">

            <h2 className="text-xl font-bold mb-3">
              {editId ? "Modifier" : "Ajouter"}
            </h2>

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Nom"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Prix"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Commentaire"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500"
              >
                Annuler
              </button>

              <button
                onClick={save}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Sauvegarder
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
