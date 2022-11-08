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
const { send } = require("process");

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

// Login Auth
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const getUser = "SELECT password FROM users WHERE username = $1";
  const user = await db.task("post/login", async task => {
    return await task.one(getUser, [username]);
  }).catch((err) => {
    console.log(err);
    if (err.message === "No data returned from the query.") {
      // Even though format is deprecated, it still works fine and there is no other alternative. Refer to https://github.com/nodejs/node/issues/25099
      res.redirect(url.format({
        pathname:"/register",
        query: {
          message: "The username provided does not exist.",
          error: true,
          errorMessage: err
        }
      }));
    } else {
      res.status(500).render("pages/login", {
        message: "There was an error getting the username from database.",
        error: true,
        errorMessage: err
      });
    }
    return;
  });
  bcrypt.compare(password, user.password,).then((result) => {
    if (result) {
      req.session.user = {
        api_key: process.env.API_KEY,
        
      };
      req.session.save();
      // TODO: redirect to the square page
    } else {
      throw Error("Incorrect password.");
    }
  }).catch(err => {
    console.log(err);
    res.status(400).render("pages/login", { 
      message: {
        summary: "Incorrect password.",
        error: err
      },
      error: true
    });
  });
});


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

//Square Livechat Serverside Logic
var messageHistory = [];

app.get('/square', (req, res) => {
  res.status(200).render("pages/square");
});

io.on("connection", (socket) => {
  //A NEW SOCKET CONNECTED
  console.log(`[SOCKET ${socket.id[0]}] Opened.`);
  socket.square = 'general';
  assoicateSocketToUser();
  sendMessageHistory(socket);


  socket.on('message', (msg) => {
    console.log(`[SOCKET ${socket.id[0]} - ${socket.square}] ${msg.text}`);
    messageHistory.push(msg);
    if (messageHistory.length >= 80) {
      messageHistory.shift();
    }
    io.emit('message', msg);
  });
<<<<<<< HEAD
});
=======

  socket.on("changeSquare", (data) => {
    socket.square = data.square;
    sendMessageHistory(socket);
  });

  socket.on("disconnect", () => {
    console.log(`[SOCKET ${socket.id[0]}] Closed.`);
  });

});

function assoicateSocketToUser(socketId, userId) {
  //TODO
  //attach an attribute to the socket object
}

function sendMessageHistory(socket) {
  for (var i = 0; i < messageHistory.length; i++) {
    socket.emit('message', messageHistory[i]);
  }
}
>>>>>>> 1a30f94 (livechat backend logic for multiple channels)
