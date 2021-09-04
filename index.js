const express = require("express");
const app = express();
const path = require("path");
const port = process.env.port || 5000;
// //Implement and connect to the mongoDb database
// // const MongoClient = require("mongodb").MongoClient;
// // const url =
// //   "mongodb+srv://Kevin:testing123@chatapp.e61gx.mongodb.net/chat_data?retryWrites=true&w=majority";
// // MongoClient.connect(url, (err, db) => {
// //   if (err) {
// //     throw err;
// //   }
// //   console.log("Connected to the database..");
// // });

// const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://Kevin:kevin@chatapp.e61gx.mongodb.net/sample_airbnb";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err, db) => {
//   if (err) {
//     throw err;
//   }
//   console.log("Database has been connected..");
// });

//Add static folder for the frontend
app.use(express.static(path.join(__dirname, "public")));
let server = app.listen(port, () =>
  console.log("Server is listening on the port", port)
);

//Import socket.io and implement to the server
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket.emit("welcome", "Hi,Welcome from my messaging app!");

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
