import express from "express"
import {
  crearCredito,
  obtenerCreditosPorCliente,
  obtenerCreditosDelCobrador,
  abonarCredito,
  marcarComoPagado,
  obtenerCreditosPorCobrador
} from "../controllers/credito.controller.js"

import { verifyToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

/* CREAR CREDITO (ADMIN) */
router.post("/", verifyToken, (req, res, next) => {

  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "No autorizado" })
  }

  next()

}, crearCredito)

/* CREDITOS DE UN CLIENTE */
router.get("/cliente/:clienteId", verifyToken, obtenerCreditosPorCliente)

/* CREDITOS POR COBRADOR (ADMIN) */
router.get("/cobrador/:cobradorId", verifyToken, (req, res, next) => {

  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "No autorizado" })
  }

  next()

}, obtenerCreditosPorCobrador)

/* CREDITOS DEL COBRADOR LOGUEADO */
router.get("/", verifyToken, obtenerCreditosDelCobrador)

/* ABONAR CREDITO */
router.post("/abonar/:id", verifyToken, abonarCredito)

/* MARCAR CREDITO PAGADO */
router.put("/:id/pagar", verifyToken, marcarComoPagado)

export default router