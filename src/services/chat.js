const db = require("../services/database");

var messageHistory = [];
var io;

const linkToSocketioInstance = (ref) => {
  io = ref;
}

const connection = (socket) => {
 //A NEW SOCKET CONNECTED
 console.log(`[SOCKET ${socket.id[0]}] Opened.`);
 socket.square = 'general';
 sendMessageHistory(socket);


 socket.on('message', (msg) => {
   db.newChat({chatName: socket.square, message: msg.message, userId: msg.userid}).then(() => {
     console.log(`[SOCKET ${socket.id[0]} - ${socket.square}] ${msg.message}`);
     messageHistory.push(msg);
     if (messageHistory.length >= 80) {
       messageHistory.shift();
     }
     io.emit('message', msg);
    }).catch((err) => {
      console.log(err);
      socket.emit("alert", {
        message: "There was an error sending your message. Please try reloading the page.",
        errorMessage: err
      });
    });
 });

 socket.on("changeSquare", (data) => {
   socket.square = data.square;
   sendMessageHistory(socket);
 });

 socket.on("disconnect", () => {
   console.log(`[SOCKET ${socket.id[0]}] Closed.`);
 });
};

function sendMessageHistory(socket) {
  db.getChat({chatName: socket.square}).then(async (chat) => {
    messageHistory = chat;
    messageHistory.forEach((message) => {
      db.getUser({userId: message.userid}).then((user) => {
        message.username = user.username;
        message.square = socket.square;
        socket.emit('message', message);
      }).catch((err) => {
        console.log(err);
        socket.emit("alert", {
          message: "There was an error retrieving some messages. Please try reloading the page.",
          errorMessage: err
        });
      });
    });
  }).catch((err) => {
    console.log(err);
    socket.emit("alert", {
      message: "There was an error retrieving some messages. Please try reloading the page.",
      errorMessage: err
    });
  });
}

exports.connection = connection;
exports.linkToSocketioInstance = linkToSocketioInstance;