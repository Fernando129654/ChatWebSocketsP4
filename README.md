Chat WebSockets P4

1. Descripción del proyecto

Chat WebSockets P4 es una aplicación web de mensajes realizada para la tarea de Programación 4.

Permite que varios usuarios se conecten desde diferentes pestañas del navegador, seleccionen un nombre y envíen mensajes que se distribuyen inmediatamente a todos los clientes conectados.

La comunicación se realiza mediante WebSockets, lo que permite mantener una conexión bidireccional entre el navegador y el servidor.

2. Tecnologías utilizadas

HTML5: estructura de la interfaz.
CSS3: diseño visual.
JavaScript: validaciones, interacción con la interfaz y comunicación desde el navegador.
Node.js: entorno de ejecución del servidor.
Express: publicación de los archivos estáticos de la aplicación.
Ws: implementación de la comunicación mediante WebSockets.

3. Requisitos previos

Para ejecutar el proyecto localmente se necesita:

Node.js instalado.
npm, incluido con Node.js.
Un navegador web moderno.

4. Estructura del proyecto

La estructura principal es la siguiente:

ChatWebSocketsP4/
├── node_modules/
├── public/
│   ├── index.html
│   ├── style.css
│   └── client.js
├── server.js
├── package.json
├── package-lock.json
└── README.md

La carpeta "node_modules" contiene las dependencias instaladas mediante npm. Se genera al instalar los paquetes.

5. Instalación y ejecución local

Paso 1. Abrir el proyecto

Abrir la carpeta "ChatWebSocketsP4" en una terminal.

Paso 2. Instalar las dependencias

Desde la carpeta raíz del proyecto, ejecutar en el bash:

npm install

Este comando instala las dependencias definidas en "package.json".

Paso 3. Iniciar el servidor

Ejecutar en el bash:

npm start

Si el servidor inicia correctamente, la terminal mostrará mensajes similares a los siguientes:


Servidor iniciado en http://localhost:3000
Servidor WebSocket disponible en ws://localhost:3000

Paso 4. Abrir la aplicación

Abrir un navegador y visitar:

http://localhost:3000

No se debe abrir "index.html" directamente desde el sistema de archivos, ya que la aplicación necesita el servidor para establecer la conexión WebSocket.

Paso 5. Probar el chat

1. Abrir la aplicación en dos o más pestañas del navegador.
2. Escribir un nombre diferente en cada pestaña y presionar Guardar nombre.
3. Escribir un mensaje y presionar Enviar.
4. Comprobar que el mensaje y el nombre de quien lo envió aparecen en las pestañas conectadas.
5. Cerrar una pestaña y comprobar que las demás reciben el aviso de desconexión.

Para detener el servidor, regresar a la terminal y presionar "Ctrl + C".

6. Funcionamiento de la aplicación

Conexión WebSocket

El servidor utiliza Node.js, Express y la biblioteca "ws". El navegador establece una conexión WebSocket con el servidor, que permanece abierta mientras el cliente esté conectado.

Envío y recepción de mensajes

Los mensajes se transmiten en formato JSON. El servidor recibe los datos, valida su estructura y distribuye los mensajes válidos a todos los clientes conectados.

Ejemplo de un mensaje enviado al servidor:

{
  "event": "chat:message",
  "data": {
    "user": "Ana",
    "text": "Hola a todos"
  }
}

El servidor agrega una marca de tiempo y transmite el mensaje a los clientes conectados.

Eventos utilizados

chat:message: representa un mensaje enviado por un usuario.
system:info: comunica información del sistema, como el establecimiento de la conexión o la desconexión de un cliente.
system:error: comunica errores de validación o de procesamiento de mensajes.

Además, el servidor y el cliente gestionan los eventos de conexión, cierre y error propios de WebSocket.

Validaciones y manejo de errores

La aplicación comprueba que el usuario haya ingresado un nombre antes de enviar mensajes. También evita nombres vacíos, mensajes vacíos y entradas que superen los límites establecidos.

El servidor valida los datos recibidos y responde con un evento de error cuando el mensaje no cumple con el formato esperado o contiene información inválida.

La interfaz muestra el estado de la conexión para que el usuario pueda identificar si está conectado o desconectado.

7. Consideraciones

- El servidor debe permanecer en ejecución mientras se utiliza el chat.
- La aplicación se configura para ejecutarse localmente en el puerto "3000".
- Los mensajes se distribuyen a los clientes conectados en ese momento; no se almacenan permanentemente.
- Esta versión está diseñada para demostración académica y no incluye autenticación ni almacenamiento persistente de conversaciones.

8. Autoría

Hecho por:
Fernando Durán Escobar, Celula: 119600367
Alonso Durán Escobar, Celula: 119600368
