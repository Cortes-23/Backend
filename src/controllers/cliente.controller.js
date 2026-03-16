import Cliente from "../models/Cliente.js"

/* ─────────────────────────────────────────
   CREAR CLIENTE
   officeId viene del token JWT
───────────────────────────────────────── */
import User from "../models/User.js"

export const crearCliente = async (req, res) => {
  try {

    const { nombre, cedula, telefono, direccion, cobrador } = req.body

    if (!nombre || !cedula) {
      return res.status(400).json({
        message: "Nombre y cédula son obligatorios"
      })
    }

    const cedulaNormalizada = cedula.trim()

    let cobradorAsignado = req.user.userId

    if (cobrador) {

      const cobradorExiste = await User.findOne({
        _id: cobrador,
        officeId: req.user.officeId,
        rol: "COBRADOR"
      })

      if (!cobradorExiste) {
        return res.status(400).json({
          message: "Cobrador inválido para esta oficina"
        })
      }

      cobradorAsignado = cobrador
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      cedula: cedulaNormalizada,
      telefono,
      direccion,
      cobrador: cobradorAsignado,
      officeId: req.user.officeId
    })

    res.status(201).json(nuevoCliente)

  } catch (error) {

    console.error(error)

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe un cliente con esa cédula en esta oficina"
      })
    }

    res.status(500).json({
      message: "Error creando cliente"
    })
  }
}

/* ─────────────────────────────────────────
   OBTENER CLIENTES SEGÚN ROL
   COBRADOR: solo los suyos
   ADMIN: todos los de la oficina
───────────────────────────────────────── */
export const obtenerMisClientes = async (req, res) => {
  try {
    const filtro = { officeId: req.user.officeId }   // ← siempre filtra por oficina

    if (req.user.rol === "COBRADOR") {
      filtro.cobrador = req.user.userId
    }

    const clientes = await Cliente.find(filtro).populate("cobrador", "nombre email")

    return res.json(clientes)

  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo clientes" })
  }
}

/* ─────────────────────────────────────────
   OBTENER CLIENTES POR COBRADOR (ADMIN)
───────────────────────────────────────── */
export const obtenerClientesPorCobrador = async (req, res) => {
  try {
    const { cobradorId } = req.params

    const clientes = await Cliente.find({
      cobrador: cobradorId,
      officeId: req.user.officeId   // ← solo de esta oficina
    }).populate("cobrador", "nombre email")

    res.json(clientes)

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo clientes" })
  }
}