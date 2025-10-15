import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ruta principal de prueba
app.get("/", (req, res) => {
  res.send("✅ Backend de Mundo Artículos funcionando");
});

// ✅ Ruta de productos de ejemplo
app.get("/api/productos", (req, res) => {
  res.json([
    { id: 1, nombre: "Bolígrafo azul" },
    { id: 2, nombre: "Cuaderno A4" },
    { id: 3, nombre: "Marcador permanente" },
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
