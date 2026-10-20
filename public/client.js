
const statusElement = document.getElementById("connection-status");
const usernameInput = document.getElementById("username");
const saveNameButton = document.getElementById("save-name-button");
const userFeedback = document.getElementById("user-feedback");

const messagesElement = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const messageFeedback = document.getElementById("message-feedback");

let socket;
let connected = false;
let username = "";

function updateConnectionStatus(status, text) {
    statusElement.textContent = text;
    statusElement.className = `status ${status}`;

    connected = status === "connected";
    sendButton.disabled = !connected;
}

function connect() {
    updateConnectionStatus("connecting", "Conectando...");

    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    socket = new WebSocket(`${protocol}//${location.host}`);

    socket.addEventListener("open", () => {
        updateConnectionStatus("connected", "Conectado");
        addSystemMessage("Conexión WebSocket establecida.");
    });

    socket.addEventListener("message", (event) => {
        try {
            const message = JSON.parse(event.data);

            if (
                !message ||
                typeof message.event !== "string" ||
                !message.data ||
                typeof message.data !== "object"
            ) {
                addSystemMessage("El servidor envió un mensaje inválido.");
                return;
            }

            switch (message.event) {
                case "chat:message":
                    displayMessage(message.data);
                    break;

                case "system:info":
                    addSystemMessage(message.data.message);
                    break;

                case "system:error":
                    messageFeedback.textContent =
                        message.data.message || "Ocurrió un error.";
                    break;

                default:
                    addSystemMessage("Se recibió un evento desconocido.");
            }
        } catch (error) {
            addSystemMessage("No se pudo interpretar la respuesta del servidor.");
        }
    });

    socket.addEventListener("close", () => {
        updateConnectionStatus("disconnected", "Desconectado");
        addSystemMessage("Se perdió la conexión con el servidor.");
    });

    socket.addEventListener("error", () => {
        addSystemMessage("Ocurrió un error en la conexión WebSocket.");
    });
}

function addSystemMessage(text) {
    const element = document.createElement("p");
    element.className = "system-message";
    element.textContent = text;

    messagesElement.appendChild(element);
    scrollToBottom();
}

function displayMessage(data) {
    if (
        typeof data.user !== "string" ||
        typeof data.text !== "string"
    ) {
        addSystemMessage("Se recibió un mensaje con datos inválidos.");
        return;
    }

    const emptyMessage = messagesElement.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const messageElement = document.createElement("article");
    messageElement.className = "message";

    const authorElement = document.createElement("p");
    authorElement.className = "message-author";
    authorElement.textContent = data.user;

    const textElement = document.createElement("p");
    textElement.className = "message-text";
    textElement.textContent = data.text;

    const timeElement = document.createElement("p");
    timeElement.className = "message-time";

    const date = new Date(data.timestamp);
    timeElement.textContent = Number.isNaN(date.getTime())
        ? ""
        : date.toLocaleTimeString("es-CR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    messageElement.append(authorElement, textElement, timeElement);
    messagesElement.appendChild(messageElement);

    scrollToBottom();
}

function scrollToBottom() {
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

saveNameButton.addEventListener("click", () => {
    const name = usernameInput.value.trim();

    if (!name) {
        userFeedback.textContent = "Escribe tu nombre antes de guardarlo.";
        return;
    }

    if (name.length > 30) {
        userFeedback.textContent = "El nombre no puede superar 30 caracteres.";
        return;
    }

    username = name;
    usernameInput.value = name;
    userFeedback.textContent = `Nombre guardado: ${username}`;
    messageFeedback.textContent = "";
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    messageFeedback.textContent = "";

    if (!connected || !socket || socket.readyState !== WebSocket.OPEN) {
        messageFeedback.textContent = "No hay conexión con el servidor.";
        return;
    }

    if (!username) {
        messageFeedback.textContent = "Primero debes guardar tu nombre.";
        return;
    }

    const text = messageInput.value.trim();

    if (!text) {
        messageFeedback.textContent = "El mensaje no puede estar vacío.";
        return;
    }

    if (text.length > 500) {
        messageFeedback.textContent =
            "El mensaje no puede superar 500 caracteres.";
        return;
    }

    socket.send(JSON.stringify({
        event: "chat:message",
        data: {
            user: username,
            text: text
        }
    }));

    messageInput.value = "";
    messageInput.focus();
});

connect();
