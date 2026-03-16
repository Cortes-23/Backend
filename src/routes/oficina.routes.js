import express from "express"
import {
  createOffice,
  getOffices,
  getOfficeBySlug
} from "../controllers/office.controller.js"

import { verifyToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

/* ─────────────────────────────────────────
   CREAR OFICINA
   Solo SUPERADMIN debería hacerlo
───────────────────────────────────────── */
router.post("/", verifyToken, createOffice)

/* ─────────────────────────────────────────
   OBTENER TODAS LAS OFICINAS
   Solo SUPERADMIN
───────────────────────────────────────── */
router.get("/", verifyToken, getOffices)

/* ─────────────────────────────────────────
   OBTENER OFICINA POR SLUG
   Usado para login multioficina
───────────────────────────────────────── */
router.get("/:slug", getOfficeBySlug)

export default router