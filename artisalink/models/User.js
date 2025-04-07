import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },

    first_name: {
        type: String,
        required: true,
    },

    last_name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    cartItems: {
        type: Object,
        default: {}
    },

}, { minimize: false });

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;