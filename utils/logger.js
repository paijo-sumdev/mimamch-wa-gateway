const winston = require("winston");
const { DateTime } = require("luxon");
const { v4: uuidv4  } = require("uuid");

const logFileName = () => {
    return DateTime.local().toFormat("yyyy-MM-dd");
};

const createLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `logs/${logFileName()}.log` })
    ],
});

const logger = (metadata, message) => {
    const idLogger = metadata.idLogger ? metadata.idLogger : uuidv4();
    const activity = metadata.activity ? metadata.activity : "unknown-activity";
    const type = metadata.type ? metadata.type : "info";
    const dataToLog = `[${idLogger}] [${activity}] ${message}`;
    
    if (type === "info") {
        createLogger.info(dataToLog);
    }

    if (type === "warn") {
        createLogger.warn(dataToLog);
    }
};

module.exports = logger;