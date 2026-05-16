const API = "http://localhost:3001";

export const getProducts = async () => {
  const res = await fetch(`${API}/products`);
  return res.json();
};

export const createProduct = async (data) => {
  const res = await fetch(`${API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  await fetch(`${API}/products/${id}`, { method: "DELETE" });
};

export const updateProduct = async (id, data) => {
  await fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const uploadImage = async (file) => {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${API}/upload`, {
    method: "POST",
    body: form,
  });

  return res.json();
};
