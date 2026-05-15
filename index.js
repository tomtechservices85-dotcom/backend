import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

/* ---------------- MIDDLEWARES ---------------- */

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

console.log("DB =", process.env.DATABASE_URL);

/* ---------------- MULTER CONFIG ---------------- */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ---------------- UPLOAD IMAGE ---------------- */

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("FILE RECEIVED:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    url: `http://localhost:3001/uploads/${req.file.filename}`,
  });
});

/* ---------------- PRODUCTS ---------------- */

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const product = await prisma.product.create({
    data: {
      ...req.body,
      price: Number(req.body.price),
    },
  });

  res.json(product);
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      ...req.body,
      price: Number(req.body.price),
    },
  });

  res.json(product);
});

app.delete("/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "deleted" });
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

/* ---------------- START SERVER ---------------- */

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
