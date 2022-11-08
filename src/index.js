const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const http = require('http');
const socketio = require("socket.io");

//routes
const defaultRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const squareRouter = require("./routes/square");
const registerRouter = require("./routes/register");

const app = express();
const server = http.createServer(app);
const chatLogic = require("./services/chat")
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

// Enable EJS Template Engine
app.set("view engine", "ejs");

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

// Setup user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

//serve the static resource files
app.use(express.static('resources'));

//TODO: actually implement the auth flow, 
//the / endpoint should redirect to square,
// using this auth middleware to catch user who need to login and handle them seperatley
const auth = (req, res, next) => {
  if (!req.session.user) {
    //Default to login page.
    //return res.redirect("/login");
  }
  next();
};
app.use(auth);

app.use("/", defaultRouter);

app.use("/login", loginRouter);

app.use("/register", registerRouter);

app.use("/square", squareRouter);

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));