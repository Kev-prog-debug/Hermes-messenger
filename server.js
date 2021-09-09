const express = require("express");
const app = express();
const path = require("path");
const port = process.env.port || 5000;
//Implementing mongodb client
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://localhost:27017";

//add static folder
app.use(express.static(path.join(__dirname, "public")));
let server = app.listen(port, () =>
  console.log("Server is listening on the port", port)
);

//Import socket.io and implement to the server
MongoClient.connect(uri, (err, client) => {
  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    //Welcoming message
    socket.emit("welcome", {
      text: "Hi,Welcome from my messaging app!",
      time: Date(),
    });
    socket.on("joined_users", (users) => {
      socket.broadcast.emit("joined_users", users);
    });
    //show message when server is disconnected
    socket.on("disconnet", () => {
      socket.emit("disconnect", "Sorry,server is closed!");
    });
    //indication for typing
    socket.on("typing", (indicator) => {
      socket.broadcast.emit("typing", indicator);
    });
    //add username to the db
    socket.on("users", (username) => {
      var cursor = client.db("users").collection("users_id");
      cursor.insertOne({ name: username });
    });
    socket.on("message", (data) => {
      io.sockets.emit("text", {
        text: data.input,
        username: data.username,
        time: Date(),
      });
    });
  });
});
