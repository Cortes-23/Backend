import { Router } from "express"

import { 
  loginAdmin, 
  loginCobrador, 
  loginSuperAdmin,
  createSuperAdmin,
  createFirstSuperAdmin,
  superAdminExists
} from "../controllers/auth.controller.js"

import verifyToken from "../middlewares/verifyToken.js"

const router = Router()

/* ─────────────────────────────
   Ruta de prueba
───────────────────────────── */

router.get("/", (req, res) => {
  res.json({ message: "Auth funcionando correctamente" })
})

/* ─────────────────────────────
   SUPERADMIN
───────────────────────────── */

/* Verificar si existe SuperAdmin */
router.get("/superadmin-exists", superAdminExists)

/* Crear primer SuperAdmin (solo si no existe ninguno) */
router.post("/create-first-superadmin", createFirstSuperAdmin)

/* Crear otro SuperAdmin (solo SuperAdmin logueado) */
router.post("/create-superadmin", verifyToken, createSuperAdmin)


/* ─────────────────────────────
   LOGIN
───────────────────────────── */

router.post("/login-superadmin", loginSuperAdmin)

router.post("/login-admin", loginAdmin)

router.post("/login-cobrador", loginCobrador)

export default router