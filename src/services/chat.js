const db = require("../services/database");

var io;
const linkToSocketioInstance = (ref) => {
  io = ref;
}

const connection = (socket) => {
  //A NEW SOCKET CONNECTED
  //console.log(`[SOCKET ${socket.id[0]}] Opened.`);
  socket.square = 'general';
  sendMessageHistory(socket);


  socket.on('message', (msg) => {
    db.newChat({chatName: socket.square, message: msg.message, userId: msg.userid, perks: msg.perks}).then(() => {
      console.log(`[SOCKET ${socket.id[0]} - ${socket.square}] ${msg.message} (${msg.perks})`);
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
    //console.log(`[SOCKET ${socket.id[0]}] Closed.`);
    /* ==ALERT TESTING==
     io.emit('alert', {
       message: "Example alert text.",
       errorMessage: "A user disconnected."
     });
    */
  });
};

function sendMessageHistory(socket) {
  db.getChat({chatName: socket.square}).then(async (chat) => {
    var messageHistory = chat;
    messageHistory.forEach((message) => {
      db.getUser({userId: message.userid}).then((user) => {
        message.username = user.username;
        message.square = socket.square;
        socket.emit('message', message);
      }).catch((err) => {
        console.log(err);
        if (err.received > 0) { //dont send an error saying we can't load messages if there was no messages to load
          socket.emit("alert", {
            message: "There was an error retrieving some messages. Please try reloading the page.",
            errorMessage: err
          });
        }
      });
    });
  }).catch((err) => {
    console.log(err);
    // dont send an error saying we can't load messages if there was no messages to load
    if (err.received > 0) {
      socket.emit("alert", {
        message: "There was an error retrieving some messages. Please try reloading the page.",
        errorMessage: err
      });
    }
  });
}

exports.connection = connection;
exports.linkToSocketioInstance = linkToSocketioInstance;