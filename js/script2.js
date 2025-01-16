let nombre = sessionStorage.getItem("nombre");
let apellido = sessionStorage.getItem("apellido");
if (nombre && apellido) {
    let welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent =`Bienvenido, ${nombre} ${apellido}!!!`;
}

getSessionValues();

