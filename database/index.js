const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger.js");

const connectDB = async (logMeta) => {
    const idLogger = logMeta.idLogger ? logMeta.idLogger : uuidv4();
    const activity = logMeta.activity ? logMeta.activity : "connect-database";
    const DATABASE_URI = process.env.DATABASE_URI;

    try {
        await mongoose.connect(DATABASE_URI);
        logger({ idLogger, activity }, `succes to connect ${DATABASE_URI}`);
    } catch (err) {
        logger({ idLogger, activity, type: "warn" }, `failed to connect ${DATABASE_URI}`);

        process.exit(1);
    }
}

module.exports = connectDB;