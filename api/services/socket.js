// socket.js
const ChatMessage = require("../models/chat-message");
module.exports = function (io) {
  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("messageDeleted", (chatId) => {
      socket.broadcast.emit("messageDeleted", { chatId });
    });

    socket.on("messageRead", ({ chatId }) => {
      socket.broadcast.emit("messageRead", { chatId });
    });

    socket.on("joinChat", ({ userId }) => {
      console.log("new client joined chat");

      onlineUsers[userId] = socket.id;
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on(
      "sendMessage",
      ({ chatInstanceId, senderId, receiverId, message, isReply, replyTo }) => {
        const { text, isText, mediaFilePath } = message;
        const newMessage = new ChatMessage({
          chatInstanceId,
          senderId,
          receiverId,
          message: { text, isText, mediaFilePath },
          isReply: isReply || false,
          replyTo,
        });

        newMessage.save().then((res) => {
          io.emit("receiveMessage", newMessage);
        });
      }
    );

    socket.on("typing", ({ senderId, receiverId }) => {
      io.emit("displayTyping", { senderId, receiverId });
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      io.emit("hideTyping", { senderId, receiverId });
    });

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
