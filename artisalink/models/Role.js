import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
},
    { minimize: false });

const Role = mongoose.models.role || mongoose.model("role", roleSchema);

export default Role;