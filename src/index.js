const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const http = require('http');

const defaultRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");

const app = express();
const server = http.createServer(app);

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

// Setup user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use("/", defaultRouter);

app.use("/login", loginRouter);

app.use("/register", registerRouter);

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));