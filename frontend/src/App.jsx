import { useEffect, useState } from "react";
import { getProducts, deleteProduct, uploadImage } from "./api/products";

export default function App() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ---------------- LOAD ---------------- */

  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------- UPLOAD MULTIPLE ---------------- */
const uploadImages = async () => {
  const urls = [];

  for (const file of files) {
    const res = await uploadImage(file);
    urls.push(res.url);
  }

  return urls;
};

  /* ---------------- SAVE (CREATE + UPDATE) ---------------- */
  
const saveProduct = async () => {
  console.log("🔥 CLICK AJOUT PRODUIT");
    let imagesUrl = [];

    if (files.length > 0) {
      imagesUrl = await uploadImages();
    }

    const url = editingId
      ? `https://backend-3023.onrender.com${editingId}`
      : "https://backend-3023.onrender.com";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        images: imagesUrl,
        categories,
        comment,
      }),
    });

    resetForm();
    load();
  };

  /* ---------------- EDIT ---------------- */

  const startEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
    setCategories(p.categories || []);
    setComment(p.comment || "");
  };

  /* ---------------- RESET FORM ---------------- */

  const resetForm = () => {
    setName("");
    setPrice("");
    setFiles([]);
    setCategories([]);
    setComment("");
    setEditingId(null);
  };

  /* ---------------- DELETE ---------------- */

  const remove = async (id) => {
    await deleteProduct(id);
    load();
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 Dashboard Produits</h1>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Catégories (ex: food,toy,deco)"
          onChange={(e) =>
            setCategories(
              e.target.value.split(",").map((c) => c.trim())
            )
          }
        />

        <textarea
          placeholder="Commentaire"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* MULTI FILE */}
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button onClick={saveProduct}>
          {editingId ? "Modifier produit" : "Ajouter produit"}
        </button>

        {editingId && (
          <button onClick={resetForm} style={{ marginLeft: 10 }}>
            Annuler
          </button>
        )}
      </div>

      {/* LIST */}
      {products.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}
        >
          <h3>{p.name}</h3>

          {/* IMAGES MULTIPLES */}
          {p.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              width={80}
              style={{ marginRight: 5 }}
            />
          ))}

          <p>{p.price} €</p>

          <p>
            <b>Catégories :</b>{" "}
            {p.categories?.map((c, i) => (
              <span key={i} style={{ marginRight: 5 }}>
                #{c}
              </span>
            ))}
          </p>

          <p>
            <b>Commentaire :</b> {p.comment}
          </p>

          <button onClick={() => startEdit(p)}>Modifier</button>
          <button onClick={() => remove(p.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
