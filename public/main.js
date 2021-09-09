const socket = io.connect("http://localhost:5000");

//html DOM elements
var input = document.getElementById("textbox"),
  btn = document.getElementById("btn"),
  display = document.getElementById("msg_display"),
  msg = document.getElementById("msg_box"),
  indication = document.getElementById("indicator"),
  modalBtn = document.getElementById("modal_btn"),
  username = document.getElementById("username"),
  incoming_msg = document.getElementById("realTime_msg");
time = document.getElementById("time_date");
//Welcome message
socket.on("welcome", (message) => {
  msg.innerHTML = message.text;
  time.innerHTML = message.time;
});
//Display a message when server is closed
socket.on("disconnect", (message) => {
  display.innerHTML += `<h2>${message}</h2>`;
});

//Add indicator for typing message
//try to add an element in index.html
input.addEventListener("keypress", () => {
  socket.emit("typing", "A user is typing...");
});
socket.on("typing", (indicator) => {
  indication.innerHTML = `<div id="indicator">
  <p>${indicator}</p>
  </div>`;
});
//MESSAGES
btn.addEventListener("click", () => {
  socket.emit("message", { input: input.value, username: username.value });
});
socket.on("text", (data) => {
  //Empty inside the textbox
  indication.innerHTML = "";
  input.value = "";
  //incoming message
  incoming_msg.innerHTML += ` <div class="incoming_msg">
  <div class="received_msg">
  <div class='username'>${data.username}</div>
    <div class="received_withd_msg">
      <p>${data.text}</p>
      <span class="time_date">${data.time}</span>
    </div>
  </div>
</div>`;
});

//Programs for the modal form
modalBtn.addEventListener("click", () => {
  socket.emit("users", username.value);
  socket.emit("joined_users", username.value);
  socket.on("joined_users", (users) => {
    incoming_msg.innerHTML += `<div id="joined_users"><p style="margin-left:40%; opacity:40%">${users} joined the chat</p></div>`;
  });
});
