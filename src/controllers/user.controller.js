import User from "../models/User.js"



export const createSuperAdmin = async (req, res) => {
  try {
    const user = new User({
      nombre: "Super Admin",
      cedula: "123456",
      celular: "3000000000",
      direccion: "Admin",
      email: "admin@test.com",
      password: "123456",
      rol: "SUPERADMIN"
    })

    await user.save()

    res.json({ message: "SuperAdmin creado" })

  } catch (error) {
    res.status(500).json(error)
  }
}



/* CREAR USUARIO */
export const crearUsuario = async (req, res) => {
  try {

    const { nombre, cedula, celular, direccion, email, password, rol } = req.body

    if (!nombre || !cedula || !celular || !direccion || !email || !password || !rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios" })
    }

    // ADMIN solo puede crear cobradores
    if (req.user.rol === "ADMIN" && rol !== "COBRADOR") {
      return res.status(403).json({ message: "Solo puede crear cobradores" })
    }

    const rolesPermitidos = ["COBRADOR"]
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" })
    }

    const emailNormalizado = email.trim().toLowerCase()

    const existeEmail = await User.findOne({ email: emailNormalizado })
    if (existeEmail) {
      return res.status(400).json({ message: "El usuario ya existe" })
    }

    const existeCedula = await User.findOne({ cedula })
    if (existeCedula) {
      return res.status(400).json({ message: "Ya existe un usuario con esta cédula" })
    }

    const nuevoUsuario = new User({
      nombre,
      cedula,
      celular,
      direccion,
      email: emailNormalizado,
      password,
      rol,
      officeId: req.user.officeId
    })

    await nuevoUsuario.save()

    res.status(201).json({
      message: "Usuario creado correctamente"
    })

  } catch (error) {

    console.error("ERROR CREAR USUARIO:", error)

    res.status(500).json({
      message: "Error creando usuario"
    })
  }
}


/* LISTAR COBRADORES */
export const listarCobradores = async (req, res) => {
  try {

    const cobradores = await User.find({
      officeId: req.user.officeId,
      rol: "COBRADOR"
    }).select("-password")

    res.json(cobradores)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error obteniendo cobradores"
    })
  }
}


/* HABILITAR / DESHABILITAR COBRADOR */
export const toggleHabilitado = async (req, res) => {
  try {

    const { id } = req.params

    const cobrador = await User.findOne({
      _id: id,
      officeId: req.user.officeId
    })

    if (!cobrador) {
      return res.status(404).json({
        message: "Cobrador no encontrado"
      })
    }

    cobrador.habilitado = !cobrador.habilitado

    await cobrador.save()

    res.json({
      message: `Cobrador ${cobrador.habilitado ? "habilitado" : "deshabilitado"}`
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error actualizando cobrador"
    })
  }
}