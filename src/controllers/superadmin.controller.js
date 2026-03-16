import SuperAdmin from "../models/SuperAdmin.js"
import bcrypt from "bcryptjs"

export const createSuperAdmin = async (req, res) => {

  try {

    const { nombre, email, password } = req.body

    const exist = await SuperAdmin.findOne({ email })

    if (exist) {
      return res.status(400).json({
        message: "El super admin ya existe"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newSuperAdmin = new SuperAdmin({
      nombre,
      email,
      password: hashedPassword
    })

    await newSuperAdmin.save()

    res.json({
      message: "Super Admin creado correctamente"
    })

  } catch (error) {

    res.status(500).json({
      message: "Error creando super admin"
    })

  }

}