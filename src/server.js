import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/userRoutes.js"
import clienteRoutes from "./routes/cliente.routes.js"
import creditoRoutes from "./routes/credito.routes.js"
import officeRoutes from "./routes/oficina.routes.js"
import superadminRoutes from "./routes/Superadmin.routes.js"

dotenv.config()

const app = express()

/* CORS (IMPORTANTE para Vercel) */
app.use(
  cors({
    origin: [
      "*"
    ],
    credentials: true
  })
)

app.use(express.json())

/* RUTA DE PRUEBA */
app.get("/", (req, res) => {
  res.send("API de Cobros funcionando 🚀")
})

/* RUTAS */
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/clientes", clienteRoutes)
app.use("/api/creditos", creditoRoutes)
app.use("/api/oficinas", officeRoutes)
app.use("/api/superadmin", superadminRoutes)

/* PUERTO */
const PORT = process.env.PORT || 5000

/* CONEXION MONGODB Y ARRANQUE DEL SERVER */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB")

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    })
  })
  .catch((error) => {
    console.log("❌ Error conectando MongoDB")
    console.log(error)
  })