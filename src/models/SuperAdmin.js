import mongoose from "mongoose"

const superAdminSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  rol: {
    type: String,
    default: "SUPERADMIN"
  }

}, { timestamps: true })

export default mongoose.model("SuperAdmin", superAdminSchema)