// socket.js
const ChatMessage = require("../models/chat-message");
module.exports = function (io) {
  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinChat", ({ userId }) => {
      console.log("new client joined chat");

      onlineUsers[userId] = socket.id;
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on(
      "sendMessage",
      ({ chatInstanceId, senderId, receiverId, message }) => {
        const { text } = message;
        const newMessage = new ChatMessage({
          chatInstanceId,
          senderId,
          receiverId,
          message: { text },
        });

        newMessage.save().then((res) => {
          io.emit("receiveMessage", newMessage);
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      const userId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id
      );
      if (userId) {
        delete onlineUsers[userId];
        onlineUsers.delete(userId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
    });
  });
};
