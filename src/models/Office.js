import mongoose from "mongoose"

const officeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3
    },

    address: { type: String },

    phone: { type: String },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

/* INDEX */
officeSchema.index({ slug: 1 })

export default mongoose.model("Office", officeSchema)