import { useState } from "react";
import { uploadImage } from "../api/upload";

export default function ProductForm() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const res = await uploadImage(file);
    console.log(res.url);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
