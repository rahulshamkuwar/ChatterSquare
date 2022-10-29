const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const axios = require("axios");
var http = require("http").Server(app);
var io = require("socket.io")(http);

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

io.on("connection", () =>{
 console.log("a user is connected")
});

app.listen(3000);
console.log("Server is listening on port 3000");