const socket = io();
const totalClients = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

socket.on("clients-total", (data) => {
  totalClients.innerText = `Total Clients: ${data}`;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  if (messageInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMgs, data) {
  const element = `
        <li class="${isOwnMgs ? "message-right" : "message-left"}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
    `;
  messageContainer.innerHTML += element;
  scrollBottom();
}

function scrollBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
