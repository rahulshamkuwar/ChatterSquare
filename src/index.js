const express = require("express");
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const axios = require("axios");
const socketio = require("socket.io");
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;
const url = require('url');

// database configuration
const dbConfig = {
  host: "db",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// Test DB
db.connect().then(obj => {
  console.log("Database connection successful"); // you can view this message in the docker compose logs
  obj.done(); // success, release the connection;
}).catch(error => {
  console.log("ERROR:", error.message || error);
});

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

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get('/login', (req, res) => {
  res.status(200).render("pages/login");
});

app.get('/register', (req, res) => {
  res.status(200).render("pages/register", req.query);
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users(username, password, isAdmin) VALUES ($1, $2, $3)";

  db.task("post/register", async task => {
    return await task.none(query, [username, hashedPassword, false]);
  }).then(() => {
    // Even though format is deprecated, it still works fine and there is no other alternative. Refer to https://github.com/nodejs/node/issues/25099
    res.redirect(url.format({
      pathname:"/login",
      query: {
        message: "Account successfully created.",
        error: false,
        errorMessage: ""
      }
    }));
  }).catch((err) => {
    console.log(err);
    if (err.constraint === "users_pkey") {
      res.status(400).render("pages/register", {
        message: "The user provided already exists.",
        error: true,
        errorMessage: err
      });
    } else {
      res.status(500).render("pages/register", {
        message: "There was an error inserting to database.",
        error: true,
        errorMessage: err
      });
    }
  });
});

io.on("connection", (socket) => {
 console.log("A user is connected");
});

server.listen(3000, () => console.log(`Server is listening on port ${PORT}`));