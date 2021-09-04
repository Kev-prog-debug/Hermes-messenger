const socket = io.connect("ws://localhost:5000");

//html DOM elements
var input = document.getElementById("textbox"),
  btn = document.getElementById("btn"),
  display = document.getElementById("msg_display"),
  msg = document.getElementById("msg_box"),
  indication = document.getElementById("indicator"),
  incoming_msg = document.getElementById("realTime_msg");
//Welcome message
socket.on("welcome", (message) => {
  msg.innerHTML = message;
});

btn.addEventListener("click", () => {
  socket.emit("message", input.value);
});
socket.on("text", (data) => {
  console.log(data);
  indication.innerHTML = "";
  input.value = "";
  incoming_msg.innerHTML += ` <div class="incoming_msg">
  <div class="received_msg">
    <div class="received_withd_msg">
      <p>${data.message}</p>
      <span class="time_date">${data.time}</span>
    </div>
  </div>
</div>`;
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
//Display a message when server is closed
socket.on("disconnect", (message) => {
  display.innerHTML += `<h2>${message}</h2>`;
});
