const express = require("express");
const app = express();
const path = require("path");
const port = process.env.port || 5000;

//Connect to the Db
// const mongodb = require("mongodb").MongoClient;
// const uri = "mongodb://localhost:27017";
// mongodb.connect(uri, (err, client) => {
//   if (err) {
//     throw err;
//   }
//   let db = client.db("users");
//   console.log(
//     db
//       .collection("users_id")
//       .insertOne({ name: "Gway Si kg", age: 22, address: "Yangon" })
//   );
// });
//add static folder
app.use(express.static(path.join(__dirname, "public")));
let server = app.listen(port, () =>
  console.log("Server is listening on the port", port)
);

//Import socket.io and implement to the server
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket.emit("welcome", {
    text: "Hi,Welcome from my messaging app!",
    time: Date(),
  });

  socket.on("message", (data) => {
    io.sockets.emit("text", {
      message: data,
      time: Date(),
    });
  });
  //show message when server is disconnected
  socket.on("disconnet", () => {
    socket.emit("disconnect", "Sorry,server is closed!");
  });
  //adding indication for typing
  socket.on("typing", (indicator) => {
    socket.broadcast.emit("typing", indicator);
  });
});
