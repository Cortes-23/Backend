import { Router } from "express"
import { loginAdmin, loginCobrador, loginSuperAdmin } from "../controllers/auth.controller.js"

const router = Router()

/* Ruta de prueba */
router.get("/", (req, res) => {
  res.json({ message: "Auth funcionando correctamente" })
})

/* Login */
router.post("/login-admin", loginAdmin)
router.post("/login-cobrador", loginCobrador)
router.post("/login-superadmin", loginSuperAdmin)
router.post("/create-superadmin", createSuperAdmin)
export default router