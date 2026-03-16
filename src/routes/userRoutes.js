import express from "express"
import { crearUsuario } from "../controllers/user.controller.js"
import User from "../models/User.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

/* CREAR USUARIO */
router.post("/", verifyToken, async (req, res, next) => {

  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "No autorizado" })
  }

  next()

}, crearUsuario)


/* LISTAR COBRADORES DE LA OFICINA */
router.get("/", verifyToken, async (req, res) => {
  try {

    const users = await User.find({
      officeId: req.user.officeId,
      rol: "COBRADOR"
    })

    res.json(users)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error obteniendo usuarios" })
  }
})


/* HABILITAR / DESHABILITAR COBRADOR */
router.put("/habilitar/:id", verifyToken, async (req, res) => {
  try {

    if (req.user.rol !== "ADMIN") {
      return res.status(403).json({ message: "No autorizado" })
    }

    const { id } = req.params
    const { habilitado } = req.body

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        officeId: req.user.officeId,
        rol: "COBRADOR"
      },
      { habilitado },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado en esta oficina"
      })
    }

    res.json(user)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error actualizando usuario" })
  }
})

export default router