
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

app.use(express.static("public"));

function broadcast(message) {
    const data = JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on("connection", (socket) => {
    console.log("Un cliente se ha conectado.");

    socket.send(JSON.stringify({
        event: "system:info",
        data: {
            message: "Conexión establecida con el servidor."
        }
    }));

    socket.on("message", (rawMessage) => {
        try {
            const message = JSON.parse(rawMessage.toString());

            if (
                !message ||
                typeof message !== "object" ||
                Array.isArray(message) ||
                typeof message.event !== "string" ||
                !message.data ||
                typeof message.data !== "object" ||
                Array.isArray(message.data)
            ) {
                socket.send(JSON.stringify({
                    event: "system:error",
                    data: { message: "Formato de mensaje inválido." }
                }));
                return;
            }

            if (message.event === "chat:message") {
                const { user, text } = message.data;

                if (
                    typeof user !== "string" ||
                    typeof text !== "string" ||
                    user.trim().length === 0 ||
                    text.trim().length === 0 ||
                    user.length > 30 ||
                    text.length > 500
                ) {
                    socket.send(JSON.stringify({
                        event: "system:error",
                        data: {
                            message: "El nombre debe tener entre 1 y 30 caracteres y el mensaje entre 1 y 500."
                        }
                    }));
                    return;
                }

                broadcast({
                    event: "chat:message",
                    data: {
                        user: user.trim(),
                        text: text.trim(),
                        timestamp: new Date().toISOString()
                    }
                });
            } else {
                socket.send(JSON.stringify({
                    event: "system:error",
                    data: { message: "Evento no reconocido." }
                }));
            }
        } catch (error) {
            socket.send(JSON.stringify({
                event: "system:error",
                data: { message: "No se pudo interpretar el mensaje JSON." }
            }));
        }
    });

    socket.on("close", () => {
        console.log("Un cliente se ha desconectado.");

        broadcast({
            event: "system:info",
            data: { message: "Un usuario se ha desconectado." }
        });
    });

    socket.on("error", (error) => {
        console.error("Error de WebSocket:", error.message);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    console.log(`Servidor WebSocket disponible en ws://localhost:${PORT}`);
});
