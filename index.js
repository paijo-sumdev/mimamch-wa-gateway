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
server.on("listening", () => console.log("APP IS RUNNING ON PORT " + PORT));

server.listen(PORT);

whatsapp.onConnected((session) => {
  console.log("connected => ", session);
});

whatsapp.onDisconnected((session) => {
  console.log("disconnected => ", session);
});

whatsapp.onConnecting((session) => {
  console.log("connecting => ", session);
});

whatsapp.onMessageReceived(async (session) => {
  console.log("connecting => ", session);

  try {
    const sessionId = session.sessionId;
    const [receiver, unused] = session.key.remoteJid.split("@");
    const text = "Ini adalah *BOT WA*\n\nPesan Anda hanya akan tersimpan, jika *urgent* hubungi kami di nomor pribadi.\n\nTerimakasih.";

    if (sessionId && receiver && !session.key.fromMe) {
      const send = await whatsapp.sendTextMessage({
        sessionId,
        to: receiver,
        isGroup: false,
        text,
      });  
    }
  } catch (err) {
    console.log("error => ", err);
  }
})

whatsapp.loadSessionsFromStorage();
