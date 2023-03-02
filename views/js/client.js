const socket = io();

let fileURL;

//  Formularios
const formLogin = document.querySelector("#formLogin");
const formShowUsers = document.querySelector("#formShowUsers");
const formChatGrupal = document.querySelector("#chatGrupal");

//  Inputs
const usernameInput = document.querySelector("#userNickName");
const usernameButton = document.querySelector("#registerUser");
const inputMessage = document.querySelector(".inputMessage");
const inputMessageButton = document.querySelector(".inputMessageButton");
const photoInput = document.querySelector(".photoInput");
const photoButton = document.querySelector(".photoButton");

//  Globals
const messagesList = document.querySelector(".messages");
const conectedUsers = document.querySelector(".conectedUsers");

formChatGrupal.style.display = "none";
formShowUsers.style.display = "none";

socket.on("activeSessions", (users) => {
  conectedUsers.innerHTML = "";
  for (const user in users) {
    conectedUsers.insertAdjacentHTML("beforeend", `<li>${user}</li>`);
  }
});

socket.on("login", () => {
  alert("Bienvenido al Chat, respeta las reglas!");
  formLogin.style.display = "none";
  formChatGrupal.style.display = "inline";
  formShowUsers.style.display = "inline";
});

socket.on("userExists", () => {
  alert("El nombre que intentas usar no esta disponible, intenta uno nuevo");
  usernameInput.value = "";
});

socket.on("sendMessage", ({ message, user, image }) => {
  messagesList.insertAdjacentHTML("beforeend", `<li>${user}: ${message}</li>`);
  if (image !== undefined) {
    const imagen = document.createElement("img");
    imagen.src = image;
    messagesList.appendChild(imagen);
  }
  window.scrollTo(0, document.body.scrollHeight);
});

usernameButton.addEventListener("click", () => {
  let username = usernameInput.value;
  socket.emit("register", username);
});

inputMessageButton.addEventListener("click", () => {
  socket.emit("sendMessage", {
    message: inputMessage.value,
    image: fileURL,
  });
  inputMessage.value = "";
  fileURL = undefined;
});

photoButton.addEventListener("click", () => {
  photoInput.click();
});

photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    fileURL = reader.result;
  };
  reader.readAsDataURL(file);
  fileURL
    ? alert("Foto Adjuntada")
    : alert("Adjunte una vez mas para confirmar");
});