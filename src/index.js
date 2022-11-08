const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const http = require('http');
const socketio = require("socket.io");
const path = require('path');

//routes
const defaultRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const squareRouter = require("./routes/square");
const registerRouter = require("./routes/register");
const profileRouter = require("./routes/profile");

const app = express();
const server = http.createServer(app);
const chatLogic = require("./services/chat")
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

// Enable EJS Template Engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

// Use parsing middleware
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



//pass socket connections to chat.js
chatLogic.linkToSocketioInstance(io);
io.on("connection", chatLogic.connection);

//serve the static resource files
app.use("/resources", express.static(path.join(__dirname, "resources")));

// Setup user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

//make sure users who aren't logged in get sent to the login page when they go to /square
const auth = (req, res, next) => {
  if (!req.session.user) {
    if (req.path !== "/login" && req.path !== "/register") {
      return res.redirect("/login");
    }
  } else {
    if (req.path === "/login" || req.path === "/register") {
      return res.redirect("/square");
    }
  }
  next();
};
app.use(auth);

app.use("/", defaultRouter);

app.use("/login", loginRouter);

app.use("/register", registerRouter);

app.use("/square", squareRouter);

app.use("/profile", profileRouter);

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));