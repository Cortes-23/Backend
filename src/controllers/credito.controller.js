import Credito from "../models/Credito.js"
import Cliente from "../models/Cliente.js"

/* ─────────────────────────────────────────
   CREAR CRÉDITO
───────────────────────────────────────── */
export const crearCredito = async (req, res) => {
  try {

    const { clienteId, montoPrestamo, montoAPagar, fechaPago } = req.body

    if (!clienteId || !montoPrestamo || !montoAPagar || !fechaPago) {
      return res.status(400).json({ message: "Datos incompletos" })
    }

    const montoPrestamoNum = Number(montoPrestamo)
    const montoAPagarNum = Number(montoAPagar)

    if (isNaN(montoPrestamoNum) || isNaN(montoAPagarNum)) {
      return res.status(400).json({ message: "Montos inválidos" })
    }

    // Verificar cliente en la misma oficina
    const cliente = await Cliente.findOne({
      _id: clienteId,
      officeId: req.user.officeId
    })

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" })
    }

    // Validar que el cliente pertenezca al cobrador (si aplica)
    if (cliente.cobrador && cliente.cobrador.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Este cliente pertenece a otro cobrador"
      })
    }

    // Verificar si ya existe un crédito pendiente
    const creditoPendiente = await Credito.findOne({
      clienteId,
      officeId: req.user.officeId,
      estado: "PENDIENTE"
    })

    if (creditoPendiente) {
      return res.status(400).json({
        message: "El cliente ya tiene un crédito pendiente"
      })
    }

    const nuevoCredito = await Credito.create({
      clienteId,
      cobradorId: req.user.userId,
      officeId: req.user.officeId,
      montoPrestamo: montoPrestamoNum,
      montoAPagar: montoAPagarNum,
      saldoPendiente: montoAPagarNum,
      fechaPago: new Date(fechaPago),
      abonos: []
    })

    res.status(201).json(nuevoCredito)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error creando crédito"
    })
  }
}


/* ─────────────────────────────────────────
   CRÉDITOS POR CLIENTE
───────────────────────────────────────── */
export const obtenerCreditosPorCliente = async (req, res) => {
  try {

    const { clienteId } = req.params

    const creditos = await Credito.find({
      clienteId,
      officeId: req.user.officeId
    })
      .populate("clienteId", "nombre cedula")
      .sort({ createdAt: -1 })

    res.json(creditos)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error obteniendo créditos"
    })
  }
}


/* ─────────────────────────────────────────
   CRÉDITOS DEL COBRADOR AUTENTICADO
───────────────────────────────────────── */
export const obtenerCreditosDelCobrador = async (req, res) => {
  try {

    const creditos = await Credito.find({
      cobradorId: req.user.userId,
      officeId: req.user.officeId
    })
      .populate("clienteId", "nombre cedula")
      .sort({ createdAt: -1 })

    res.json(creditos)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error obteniendo créditos"
    })
  }
}


/* ─────────────────────────────────────────
   ABONAR A CRÉDITO
───────────────────────────────────────── */
export const abonarCredito = async (req, res) => {
  try {

    const { id } = req.params
    const { monto } = req.body

    const montoNum = Number(monto)

    if (!montoNum || montoNum <= 0) {
      return res.status(400).json({
        message: "Monto inválido"
      })
    }

    const credito = await Credito.findOne({
      _id: id,
      officeId: req.user.officeId
    })

    if (!credito) {
      return res.status(404).json({
        message: "Crédito no encontrado"
      })
    }

    if (
      credito.cobradorId.toString() !== req.user.userId &&
      req.user.rol !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "No autorizado para este crédito"
      })
    }

    if (credito.estado === "PAGADO") {
      return res.status(400).json({
        message: "El crédito ya está pagado"
      })
    }

    if (montoNum > credito.saldoPendiente) {
      return res.status(400).json({
        message: "El abono no puede ser mayor al saldo pendiente"
      })
    }

    credito.saldoPendiente -= montoNum

    credito.abonos.push({
      monto: montoNum,
      fecha: new Date()
    })

    if (credito.saldoPendiente === 0) {
      credito.estado = "PAGADO"
    }

    await credito.save()

    res.json({
      message: "Abono registrado correctamente",
      credito
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error registrando abono"
    })
  }
}


/* ─────────────────────────────────────────
   MARCAR COMO PAGADO
───────────────────────────────────────── */
export const marcarComoPagado = async (req, res) => {
  try {

    const { id } = req.params

    const credito = await Credito.findOne({
      _id: id,
      officeId: req.user.officeId
    })

    if (!credito) {
      return res.status(404).json({
        message: "Crédito no encontrado"
      })
    }

    if (
      credito.cobradorId.toString() !== req.user.userId &&
      req.user.rol !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "No autorizado para este crédito"
      })
    }

    credito.estado = "PAGADO"
    credito.saldoPendiente = 0

    await credito.save()

    res.json({
      message: "Crédito marcado como PAGADO"
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error actualizando crédito"
    })
  }
}


/* ─────────────────────────────────────────
   CRÉDITOS POR COBRADOR (ADMIN)
───────────────────────────────────────── */
export const obtenerCreditosPorCobrador = async (req, res) => {
  try {

    const { cobradorId } = req.params

    const creditos = await Credito.find({
      cobradorId,
      officeId: req.user.officeId
    })
      .populate("clienteId", "nombre cedula")
      .sort({ createdAt: -1 })

    res.json(creditos)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error obteniendo créditos"
    })
  }
}