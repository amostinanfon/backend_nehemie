const mongoose = require('mongoose');
const { boolean } = require("webidl-conversions");


const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, unique: true},
        lastName: { type: String, required: true, unique: true},
        email: { type:String , required: true, unique: true},
        id: {type: String, required: true, unique: true},
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        image: {
            type: String
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)