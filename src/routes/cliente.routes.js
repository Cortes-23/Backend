import express from "express"
import {
  crearCliente,
  obtenerMisClientes,
  obtenerClientesPorCobrador
} from "../controllers/cliente.controller.js"

import { verifyToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

/* CREAR CLIENTE (ADMIN) */
router.post("/", verifyToken, (req, res, next) => {

  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "No autorizado" })
  }

  next()

}, crearCliente)


/* CLIENTES DE UN COBRADOR (ADMIN) */
router.get("/cobrador/:cobradorId", verifyToken, (req, res, next) => {

  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "No autorizado" })
  }

  next()

}, obtenerClientesPorCobrador)


/* CLIENTES DEL USUARIO LOGUEADO */
router.get("/", verifyToken, obtenerMisClientes)

export default router