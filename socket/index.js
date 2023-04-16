// MODULES
const { Server } = require('socket.io');

// INITS
const io = new Server({ cors: 'http://localhost:5173/' });

let onlineUsers = [];

// SERVER 
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Listen to addNewUser event from client
  socket.on('addNewUser', (userId) => {
    !onlineUsers.some(user => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id
      });
    
    console.log('Online users:', onlineUsers);

    io.emit('getOnlineUsers', onlineUsers);
  });

  // Listen to sendMessage event from client
  socket.on('sendMessage', (message) => {
    const user = onlineUsers.find(user => user.userId === message.recipientId);

    if (user) {
      io.to(user.socketId).emit('getMessage', message);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
    io.emit('getOnlineUsers', onlineUsers);

  });
});



io.listen(3000);