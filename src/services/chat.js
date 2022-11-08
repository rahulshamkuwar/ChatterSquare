var messageHistory = [];
var io;

const linkToSocketioInstance = (ref) => {
  io = ref;
}

const connection = (socket) => {
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

 socket.on("changeSquare", (data) => {
   socket.square = data.square;
   sendMessageHistory(socket);
 });

 socket.on("disconnect", () => {
   console.log(`[SOCKET ${socket.id[0]}] Closed.`);
 });
};

function assoicateSocketToUser(socketId, userId) {
 //TODO
 //attach an attribute to the socket object
}

function sendMessageHistory(socket) {
 for (var i = 0; i < messageHistory.length; i++) {
   socket.emit('message', messageHistory[i]);
 }
}

exports.connection = connection;
exports.linkToSocketioInstance = linkToSocketioInstance;
