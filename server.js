// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTA DE PRUEBA ---
app.get("/api/productos", (req, res) => {
  res.json([
    { id: 1, nombre: "Lámpara LED" },
    { id: 2, nombre: "Teclado mecánico" },
    { id: 3, nombre: "Mouse inalámbrico" },
  ]);
});

// Puerto (Render usa process.env.PORT automáticamente)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
