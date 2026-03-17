import SuperAdmin from "../models/SuperAdmin.js"
import bcrypt from "bcryptjs"

export const createSuperAdmin = async (req, res) => {

  try {

    const { nombre, email, password } = req.body

    // verificar si ya existe un super admin
    const count = await SuperAdmin.countDocuments()

    if (count > 0) {
      return res.status(403).json({
        message: "Ya existe un Super Admin"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const superAdmin = new SuperAdmin({
      nombre,
      email,
      password: hashedPassword
    })

    await superAdmin.save()

    res.json({
      message: "Super Admin creado correctamente"
    })

  } catch (error) {

    res.status(500).json({
      message: "Error creando super admin"
    })

  }

}