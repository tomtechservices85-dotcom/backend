export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:3001/upload", {
    method: "POST",
    body: formData
  });

  return res.json();
};
