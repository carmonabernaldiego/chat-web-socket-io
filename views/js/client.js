const socket = io();

let fileURL;

//  Formularios
const formLogin = document.querySelector("#formLogin");
const formContentChat = document.querySelector(".body-chat");
const formShowUsers = document.querySelector("#formShowUsers");
const formChatGrupal = document.querySelector("#formChatGrupal");

//  Textbox's
const txtUserNickName = document.querySelector("#userNickName");
const txtUserMessage = document.querySelector("#userMessage");

//  File - Image
const userFile = document.querySelector("#userFile");

//  Button's
const btnrRegisterUser = document.querySelector("#registerUser");
const btnSendMessage = document.querySelector("#sendMessage");
const btnSendFile = document.querySelector("#sendFile");

//  Print
const printUsersActive = document.querySelector("#usersActive");
const messagesList = document.querySelector(".messages");

formContentChat.style.display = "none";
formShowUsers.style.display = "none";
formChatGrupal.style.display = "none";

socket.on("login", () => {
  alert(
    "¡Bienvenido " +
      txtUserNickName.value +
      "!\nRecuerda, respetar a los demás usuarios."
  );
  formLogin.style.display = "none";
  formContentChat.style.display = "flex";
  formShowUsers.style.display = "block";
  formChatGrupal.style.display = "block";
});

socket.on("userExists", () => {
  alert(
    "El nickname: " +
      txtUserNickName.value +
      " ya está en uso, intenta con otro."
  );
  txtUserNickName.value = "";
});

socket.on("activeSessions", (users) => {
  printUsersActive.innerHTML = "";
  for (const user in users) {
    printUsersActive.insertAdjacentHTML("beforeend", `<li>${user}</li>`);
  }
});

socket.on("sendMessage", ({ message, user, image }) => {
  messagesList.insertAdjacentHTML(
    "beforeend",
    `<div class="message frnd_message"><p>${message}<br /><span>${user}</span></p></div>`
  );
  if (image !== undefined) {
    const imagen = document.createElement("img");
    imagen.src = image;
    messagesList.appendChild(imagen);
  }
});

btnrRegisterUser.addEventListener("click", () => {
  let username = txtUserNickName.value;
  socket.emit("register", username);
});

btnSendMessage.addEventListener("click", () => {
  if (txtUserMessage.value.trim() != "") {
    socket.emit("sendMessage", {
      message: txtUserMessage.value,
      image: fileURL,
    });
  }
  txtUserMessage.value = "";
  fileURL = undefined;
});

txtUserMessage.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (txtUserMessage.value.trim() != "") {
      socket.emit("sendMessage", {
        message: txtUserMessage.value,
        image: fileURL,
      });
    }
    txtUserMessage.value = "";
    fileURL = undefined;
  }
});

btnSendFile.addEventListener("click", () => {
  userFile.click();
});

userFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    fileURL = reader.result;
  };
  reader.readAsDataURL(file);
  fileURL
    ? alert("Error al adjuntar, seleccione nuevamente.")
    : alert("Foto adjunta, lista para enviar.");
});
