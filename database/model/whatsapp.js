const mongoose = require("mongoose");

const whatsappData = {
    metadata: {
        timeInsert: {
            type: Number,
            required: true,
        },
        timeUpdate: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    uuid: {
        type: String,
        required: true,
    },
    actualTime: {
        type: Date,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}

const collection = "messages";
const WhatsappSchema = new mongoose.Schema(whatsappData, { collection });
const WhatsappDB = mongoose.model(collection, WhatsappSchema);

module.exports = WhatsappDB;