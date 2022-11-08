//DEPENDENCIES:
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
<<<<<<< HEAD
const http = require('http');

const defaultRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");

const app = express();
const server = http.createServer(app);

const PORT = 3000 || process.env.PORT;
=======
const bcrypt = require("bcrypt");
const socketio = require("socket.io");
const http = require('http');
const url = require('url');

//GLOBALS:
const PORT = 3000 || process.env.PORT;
const dbConfig = {
  host: "db",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

//create server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//connect server to database
const db = pgp(dbConfig);
db.connect().then(obj => {
  console.log("Database connection successful.");
  obj.done(); // success, release the connection;
}).catch(error => {
  console.log("ERROR:", error.message || error);
});
>>>>>>> 390c359 (add proof of concept livechat functionality and some temporary frontend for it)

//app middleware
app.set("view engine", "ejs");
app.use(express.static('resources'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    // return res.redirect("/login");
  }
  next();
};
app.use(auth);

//once server is setup, start listening
server.listen(3000, () => console.log(`Server is listening on port ${PORT}`));


// For now redirects to login.
// TODO: Change to redirect to the square page when it is implemented.
app.get("/", (req, res) => {
  res.redirect("/square");
});

app.use("/login", loginRouter);

app.use("/register", registerRouter);


// Render register page
app.get('/register', (req, res) => {
  res.status(200).render("pages/register", req.query);
});

// Register Auth
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users(username, password, isAdmin) VALUES ($1, $2, $3)";

  db.task("post/register", async task => {
    return await task.none(query, [username, hashedPassword, false]);
  }).then(() => {
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

//Square Livechat Logic
var messageHistory = [];

app.get('/square', (req, res) => {
  res.status(200).render("pages/square");
});

io.on("connection", (socket) => {
  console.log("[SOCKET] New socket.");
  for (var i = 0; i < messageHistory.length; i++) {
    socket.emit('message', messageHistory[i]);
  }

  socket.on('message', (msg) => {
    messageHistory.push(msg);
    if (messageHistory.length >= 10) {
      messageHistory.shift();
    }
    io.emit('message', msg);
  });
});
