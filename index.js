const { config } = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const path = require("path");
const MainRouter = require("./app/routers");
const errorHandlerMiddleware = require("./app/middlewares/error_middleware");
const whatsapp = require("wa-multi-session");
const logger = require("./utils/logger");
const { v4: uuidv4 } = require("uuid");

config();

var app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "ejs");
// Public Path
app.use("/p", express.static(path.resolve("public")));
app.use("/p/*", (req, res) => res.status(404).send("Media Not Found"));

app.use(MainRouter);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || "5000";
app.set("port", PORT);
var server = http.createServer(app);
server.on("listening", () => {
  logger({ activity: "server-rest" }, `Server running on port ${PORT}`);
});

server.listen(PORT);

whatsapp.onConnected((session) => {
  logger({ activity: "whatsapp-api" }, `connected : ` + JSON.stringify(session));
});

whatsapp.onDisconnected((session) => {
  logger({ activity: "whatsapp-api" }, `disconnected : ` + JSON.stringify(session));
});

whatsapp.onConnecting((session) => {
  logger({ activity: "whatsapp-api" }, `connecting : ` + JSON.stringify(session));
});

whatsapp.onMessageReceived(async (session) => {
  const idLogger = uuidv4();

  if (!session.key.fromMe){
    logger({ idLogger, activity: "whatsapp-api" }, `receive msg : ` + JSON.stringify(session));
  }

  try {
    const sessionId = session.sessionId;
    const [receiver, unused] = session.key.remoteJid.split("@");
    const text = "Ini adalah *BOT WA*\n\nPesan Anda hanya akan tersimpan, jika *urgent* hubungi kami di nomor pribadi.\n\nTerimakasih.";

    if (sessionId && receiver && !session.key.fromMe && session.message) {
      const send = await whatsapp.sendTextMessage({
        sessionId,
        to: receiver,
        isGroup: false,
        text,
      });  

      if (send) {
        logger({ idLogger, activity: "whatsapp-api" }, `sent : ` + JSON.stringify(send));
      }
    }
  } catch (err) {
    logger({ idLogger, activity: "whatsapp-api", type: "warn" }, `error sending : ` + JSON.stringify(session));
  }
})

whatsapp.loadSessionsFromStorage();
