//Solución para usar rutas dinámicas con cuando lo subo a Github 
//ya agrega un directorio más y rompe las rutas
const baseURL =  window.location.origin.includes("github.io") 
                    ? `${window.location.origin}/Ecomerce-JavaScript` 
                    : window.location.origin;

//Se fuerza la cargar la página al darle atrás en lugar de ir por el menú
//ya que localmente funciona bien pero desde Github no se actualizan algunos valores
window.addEventListener("pageshow", (event) => {
        setSesionUsuario();
        setSessionValues();
    });


//Definició de la clase producto
class Producto{

    constructor(id, nombre, descripcion, imagen, precio, cantidad){
        this.id = ++id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.precio = precio;
        this.cantidad = cantidad;
        this.subtotal = 0;
    }

    calcularSubtotal(){
        this.subtotal = this.precio * this.cantidad
    }
}


//Función password_show_hide: Se utiliza para cambiar de ícono cada vez que se hace clck en la imagen de ver u ocultar password en los imputs de los formularios de login y registración
function password_show_hide(id) {

    //Se incializan las variables como si fueran los íconos del input de password
    let showId = "show_eye";
    let hideId = "hide_eye";

    //Si el id que se pasa por parámetro es para el input de confirm-password de se cambia el valor de las variables de los íconos que corresponden a ese id
    if (id === "confirm-password"){
        showId = "show_eye2";
        hideId = "hide_eye2";
    }

    //Se obtiene el elemento cuyo id se pasó por parámetro
    let x = document.getElementById(id);

    //Se obtienen los elementos que corresponden a los íconos de ese input
    let show_eye = document.getElementById(`${showId}`);
    let hide_eye = document.getElementById(`${hideId}`);

    //Se remueve la clase d-none
    hide_eye.classList.remove("d-none");

    //Si el tipo del input x es "password", se cambia a text para hacerlo visible, se oculta un ícono "ver password" y se muestra el de ocultar passowrd. en caso de que el tipo del input sea "text" se cambia a password para ocular la clave, se oculta el ícono de "ocultar" password y se muestra el de "ver" password
    if (x.type === "password") {
        x.type = "text";
        show_eye.style.display = "none";
        hide_eye.style.display = "block";
    } else {
        x.type = "password";
        show_eye.style.display = "block";
        hide_eye.style.display = "none";
    };
}


//Funcion showToast: Se utiliza para mejora mostarar un mensaje con toastify pero se le agregan algunos cambios ya que al presionar muchas veces el botón mostraba un mensaje apilado arriba del otro con el mismo texto. Para evitarlo se agregó lógica que permite saber si ya hay un mensaje activo y de esa manera no mostrar otro hasta que haya transcurrido el tiempo seteado para el mensaje
function showToast(message) {

    //Se obitiene de la sessión el valor toastTimestamp
    const toastTimestamp = sessionStorage.getItem("toastTimestamp");

    //Se inciializa variable de tiempoTranscurrido
    let tiempoTranscurrido = "";

    //Si obtuvimos un valor de la sesión calculamos el tiempo tracurrido haciendo la difenrecia entre el ahora y el timestamp guardadod en la sesión
    if (toastTimestamp !== undefined) {
        tiempoTranscurrido = Date.now() - parseInt(toastTimestamp, 10);
    }

    //Obtenemos de la sessión si ya hay un toast activo. Si lo hay sale de la función para no mostrar otro. 
    if (sessionStorage.getItem("activeToast") === "true" && tiempoTranscurrido < 2100) {
        return;
    }

    //Genero el nuevo toast con el mensaje pasado por parámetro
    Toastify({
        text: message,
        duration: 2000,
        close: true,
        gravity: "bottom", 
        position: "center",
        style: {
            background: "linear-gradient(to top left, #ec128fcc, #888888)", 
            color: "black"
        }
    }).showToast();

    //Setea en la sessión que hay un toast activo
    sessionStorage.setItem("activeToast", "true");
    sessionStorage.setItem("toastTimestamp", Date.now());

    //Transcurrido el tiempo de duración del toast se elimina de los datos de la sesión
    setTimeout(() => {
        sessionStorage.removeItem("activeToast");
        sessionStorage.removeItem("toastTimestamp");
    }, 2100);
}


//Función validarFormato: Se utiliza para validar el formatod de los inputs de email y password en los formularios de login y registración
function validarFormato(formato, valor){
    
    //Se inicializa variable
    let newRegex;

    //En casod e que el formato pasado por parámetro sea "email" se genera un regex para validar el formato
    switch (formato){
        case "email":
            newRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
            break;
        //En caso del que el formato sea password o confirm-password se genera un regex distinto para validarlo 
        case "password":
        case "confirm-password":
            newRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            break;
    }

    //Se ejecuta test para validar si el valor pasado por parámetro cumple con las reglas seteadas y se devuelve true o false
    return newRegex.test(valor);   
}


//Función login: Se dejó de utilizar al modiicar el formulario de login y la fomra en que se guardaba la ifnormación
// function login(){
//     // Usuarios registrados
//     let usuarios = [
//         {nombre: "Sebastián", apellido: "Gallegos", edad: "47", usuario: "segal", clave: "segal#01"}
//     ];

//     // Obtener valores del formulario
//     let username = document.getElementById('username').value;
//     let password = document.getElementById('password').value;
//     let message = document.getElementById('message');

//     // Validar credenciales
//     for (let i = 0; i <= usuarios.length-1; i++){

//         if (username == usuarios[0].usuario && password == usuarios[0].clave){
//             message.textContent = "";

//             let nombre = usuarios[i].nombre;
//             sessionStorage.setItem("nombre", nombre);

//             let apellido = usuarios[i].apellido
//             sessionStorage.setItem("apellido", apellido);

//             window.location.href = "./html/main_page.html";
//             //para poner esta referencia hay que tener en cuenta como si se estuviera llamando desde el html en el que estamos (en este caso en el index.html) y no como si estuvieramos en el script porque si bien acá funciona en Github no toma la referencia y no encuentra la página.
//         } else {
//                 message.textContent = "Usuario o contraseña incorrectos.";
//             };

//     }
// }


//Función nuevoUsuario: Se utiliza para dar de alta un usuario con el formulario de registración
async function nuevoUsuario(){
    //Se declara un array vacío
    let usuarios = [];
    
    //Se declara un nuevo objeto vacío
    let usuario = {};

    //Se declara una variable para indicar si hay un campo con error
    let camposConError = false;

    //Se declaran otras variables que se van a utilizar
    let inputName = "";

    let password = ""; 
    
    let usuarioIngresado = "";
    
    let emailIngresado = "";

    //Se traen los usuarios guardados en el sessionStorage
    let usuariosRegistrados = JSON.parse(sessionStorage.getItem('usuarios'));

    //Si hay usuarios registrados se asignan al array usuarios
    if (usuariosRegistrados !== null){
        usuarios = usuariosRegistrados;
    }    

    //Se traen todos los elementos "input" del formulario
    const inputs = document.querySelectorAll("input");

    //Se agrega al objeto usuario la clve y valor según el name y value de cada input obtenido
    inputs.forEach(input =>{
        //Si el imput es requerido y no tiene un valor se muestra una notificación y se guarda el nombre del campo
        if (input.required && input.value ===""){
            showToast("Por favor, complete todos los campos obligatorios!!")
            camposConError = true;
            if (inputName ===""){
                inputName = input.name;
            } 
        }

        //Se valida el formato del email ingresado
        if (input.name === "email"){
            if (!validarFormato(input.name, input.value)){
                showToast("Por favor ingrese un formato de email correcto")
                camposConError = true;
                if (inputName ===""){
                    inputName = input.name;
                } 
            }
        }

        //Cuando pasa por el input "password" se guardo el valor
        if (input.name ==="password"){
            password = input.value;
            //Se valida el formato del password ingresado
            if (!validarFormato(input.name, input.value)){
                showToast("El password no cumple con los requsitos (8 OR MORE, 1UP, 1LOW, 1NUM, 1ESPECIAL)")
                camposConError = true;
                if (inputName ===""){
                    inputName = input.name;
                } 
            }
        }

        //Cuando pasa por el campo "confirm-password" verifica si el valor es igual al del input "password" guadado previamente y si no lo es muestra una notificación
        if(input.name ==="confirm-password"){
            if (input.value !== password ){
                showToast("El password y el confirm password deben ser iguales");
                camposConError = true;
                if (inputName ===""){
                    inputName = input.name;
                } 
            }else{
                //Se valida el formato del password ingresado
                if (!validarFormato(input.name, input.value)){
                    showToast("El confirm-password no cumple con los requsitos (al menos 8 carácteres, una mayúscula, una minúscula, un número y un caracter especial ")
                    camposConError = true;
                    if (inputName ===""){
                        inputName = input.name;
                    } 
                }
            }
        }

        //Guarda el valor del input en el objeto "usuario"
        usuario[input.name] = input.value;
    })

    //Si algún campo obligatorio no está completo se sale de la función y se hace foco en ese campo
    if (camposConError) {
        document.querySelector(`input[name='${inputName}']`).focus();
        return;
    }
    
    //Se verifica si el usuario ingresado ya existe
    usuarioIngresado = usuarios.find((user) => user.username === usuario.username);

    //Se verifica si el email ingresado ya existe
    emailIngresado = usuarios.find((user) => user.email === usuario.email);

    if (emailIngresado !== undefined){
        showToast(`Ya existe un usuario registrado con "${emailIngresado.email}"`)
        return
    }

    if (usuarioIngresado !== undefined || emailIngresado !== undefined){
        showToast(`Ya existe un usuario registrado con "${usuarioIngresado.username}"`)
        return;
    }

    //Se agrega el nuevo usuario al array de objetos
    usuarios.push(usuario);

    //Se modifica el sessonStorage con el nuevo array de usuarios
    sessionStorage.setItem("usuarios", JSON.stringify(usuarios));

    //Luego de guardar los datos en el sessionStorage se limpian todos los inputs
    inputs.forEach(input =>{
        input.value = "";
    });

    //Se muestra un mensaje de registración exitoso
    await Swal.fire({
        title: "Se ha registrado exitósamente",
        text: "A continuación deberá inicar sesión",
        icon: "success",
        confirmButtonColor: "#ec128f",
        confirmButtonText: "OK",
    });

    //Se redirige al formulario de login
    window.location = `${baseURL}/html/login.html`;
}


//Función setSesionUsuario: Se utiliza para determinar si hay un usuario logueado o no. En el caso de que no lo haya muestra el ícono de inicio de sessión y el menú de iniciar sesión y registrarse. En caso de que haya un usuario logueado muestra el ícono de cerrar sessión junto con el nombre de usuario al lado, también muestra el menú correspondiente.
function setSesionUsuario(){
    //Buscar en el sessionStorage si hay un usuario logueado
    let usuario = JSON.parse(sessionStorage.getItem("datosUsuarioActual"));

    //Obtener el elemento "<a>" que contiene el ícono del login
    let loginlink = document.getElementById("login-link");
    
    //Borrar todo lo que contiene previamente el elemento "<a>"
    loginlink.innerHTML= "";

    //Obtener el elemento "<ul>" que contiene los diferentes links referidos al login
    let loginDropDown = document.getElementById("login-dropdown-menu");

    //Borrar todo lo que contiene previamente el elemento "<ul>"
    loginDropDown.innerHTML = "";

    //Crear un elemento img para cargar el log de login o logout
    let loginDropDownListItem = document.createElement("li");

    //Crear un elemento img para cargar el log de login o logout
    let loginIcon = document.createElement("img");

    //Si hay un usuario logueado: 
        //Se obtiene el elmento "<p>" correspondiente al nombre de usuario y se carga el username
        //Al elemento img creado se le asinga el ícono de logout y el alt "Cerrar Sessión"
    //Si no hay usuario logueado:
        //Se asigna al alemento img creado el ícono de login y el alt "Iniciar Sesión"
    if (usuario !== null) {
        let nombreUsuario = document.getElementById('usuario-logueado');
        nombreUsuario.textContent =`${usuario.username}`;
        loginIcon.src = `${baseURL}/assets/logout_icon.png`;
        loginIcon.alt = "Cerrar Sesión";
        loginDropDownListItem.innerHTML = `
            <a class="dropdown-item" href="#" onclick="cerrarSesion()">Cerrar Sesión</a>`;
    } else{
        loginIcon.src = `${baseURL}/assets/login_icon.png`;
        loginIcon.alt = "Iniciar Sesión";
        loginDropDownListItem.innerHTML = `
            <a class="dropdown-item" href="${baseURL}/html/login.html" onclick="setLastUrl()">Iniciar Sesión</a>
            <a class="dropdown-item" href="${baseURL}/html/signup.html" onclick="setLastUrl()">Registrarse</a>`;
    }

    //Se agrega un height y un width al img creado y se agrega el item al padre que lo va a contener
    loginIcon.height = "35";
    loginIcon.width = "35";
    loginlink.appendChild(loginIcon);
    loginDropDown.appendChild(loginDropDownListItem);
}


//Función iniciarSesion: Se utiliza para validar los datos del usuario e iniciar sessión
async function iniciarSesion(){

    try{

        //Se declara un array vacío
        let usuarios = [];

        //Se traen los usuarios guardados en el sessionStorage
        let usuariosRegistrados = JSON.parse(sessionStorage.getItem('usuarios'));

        //Si hay usuarios registrados se asignan al array usuarios
        if (usuariosRegistrados !== null){
            usuarios = usuariosRegistrados;
        }    
        
        // Obtener los elementos del formulario
        let username = document.getElementById('username');
        let password = document.getElementById('password');

        //Buscar usuario en el array obtenido
        usuarioIngresado = usuarios.find((usuario) => usuario.username === username.value);

        // Validar credenciales
        if(usuarioIngresado !== undefined 
            && usuarioIngresado.username === username.value 
            && usuarioIngresado.password === password.value)
        {
            //Grabar valores en el sessionStorage
            sessionStorage.setItem("datosUsuarioActual", JSON.stringify(usuarioIngresado));

            //Mostrar mensage de sesión iniciada correctamente
            //Aprovechando que es una función asincrónica se usa await aquí ya que de otro modo
            //se dispara el mensaje y automáticamente va a la página desde donde se llamó al login
            //y no llega a verse el mensaje de inicio de sessión correcto
            await Swal.fire({
                title: "Inicio de sesión exitoso",
                text: `Bienvenido ${usuarioIngresado.nombre} ${usuarioIngresado.apellido}!`,
                icon: "success",
                confirmButtonColor: "#ec128f",
                confirmButtonText: "OK",
            });

            //Cargar icóno y menú de cierre de sessión
            setSesionUsuario();

            //Vuelve a la página desde donde se llamó al formulario de login
                let lastUrl = sessionStorage.getItem('lastUrl');
                sessionStorage.removeItem('lastUrl');
                window.location = lastUrl;

        //Se muestra mensaje de error y se limpian los inputs
        } else{
            showToast("Usuario o contraseña incorrectos");
            username.value = "";
            password.value = "";
        }
    }catch(error){
        //Se captura cualquier otro erorr no manejado
        console.error("Ha ocurrido un error", error);
    }
}


//función setLastUrl: Se utiliza para grabar la url actual para poder volver una vez iniciada la sesión
function setLastUrl(){
    sessionStorage.setItem('lastUrl', window.location);
}


//función cerrarSesion: Se utiliza para finalizar la sessión del usuario
function cerrarSesion(){

    //Muestra un mensaje pidiendo confirmación al usaurio sobre el cierre de sesión
    Swal.fire({
        title: "Cerrar Sesión",
        text: "Confirma que desea finalizar su sessión?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ec128f",
        cancelButtonColor: "#888888",
        confirmButtonText: "Cerrarla",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            //En caso afirmativo muestra un nuevo mensaje confirmando que a sessión ha sido cerrada
            Swal.fire({
                title: "Sessión finalizada",
                text: "Usted ha cerrado su sessión correctamente ",
                icon: "success",
                confirmButtonColor: "#ec128f",
            });
            
            //Se remueven los datos de sessión del usuario
            sessionStorage.removeItem("datosUsuarioActual");
            
            //Se borra el nombre de usuario que se mantenía en la sessión
            let nombreUsuario = document.getElementById('usuario-logueado');
            nombreUsuario.textContent = ""  ;

            //Se actualizar todos los valores de sesión y los elementos correspondientes
            setSesionUsuario()
        }
    });
}


//Función verificarLogin: Se utiliza al momento de hacer click en el botón de compra para validar que haya un usuario logueado. Si no lo hay pide al uauario que se logue para poder finalizar la compra
function verificarLogin(){

    //Se obtiene de la sesssión los datos del usuario logueado
    let estaLogueado = sessionStorage.getItem("datosUsuarioActual");
    
    //Si no hay usuario logueado se muestra mensaje indicando que se loguee
    if (estaLogueado === null){
        Swal.fire({
            title: "Inicio de sesión",
            text: "Por favor inicie sesión para continuar comprando",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#ec128f",
            cancelButtonColor: "#888888",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.setItem("lastUrl", window.location);
                window.location = `${baseURL}/html/login.html`;
            }
        });
    }else{
        //si hay un usuario logueado se avanza con la compra
        comprar();  
    }
}

//Función getSessionValues: Se utiliza para obtener de la sessión los datos del carrito y se devuelve, si no hay nada se setea y devuelve un array vacío
function getSessionValues(){

    let carrito = JSON.parse(sessionStorage.getItem("miCarrito"));
        if (carrito === null) {
            carrito = [];
        }
        return carrito;
}


//Función setSessionValues: Se utiliza para actualizar los datos en sesión correspondientes al carrito, totales y cantidad de items
function setSessionValues(carrito=null){

    //Se inicializan variables
    let cantItems = 0;
    let totalItems = 0;
    
    //Si no se pasó un carrito por parametro se buscan los datos del carrito en la sessión
    if (carrito === null){
        carrito = getSessionValues();
    } else{
        //Si se pasó un carrito por parámetro, grabo los datos del carrito en la sessión
        sessionStorage.setItem("miCarrito", JSON.stringify(carrito));
    }

    //Se obtiene la cantidad de items total del carrito (entre todos los productos)
    cantItems = carrito
                    .map(prod => prod.cantidad)
                    .reduce(function(acumulador, valorActual)
                    {return acumulador + valorActual;}, 0)

    //Se obtiene el monto total del carrito
    totalItems = carrito
                    .map(prod => prod.subtotal)
                    .reduce(function(acumulador, valorActual)
                    {return acumulador + valorActual;}, 0)

    //Se guardan ambos valore sen la session
    document.getElementById('items').textContent = cantItems ?? 0;
    document.getElementById('total').textContent = formatoMoneda("ARS", totalItems ?? 0);
}


//Función addCarrito: Se utiliza para agregar productos al carrito de compras
function addCarrito(producto) {
    //Se verifica que la cantidad ingresad sea mayor a cero. De ser cero se muestra un mensaje
    if (parseInt(producto.cantidad) <= 0 ){
        alert("La cantidad del producto debe ser mayor a 0");      
    }else{
        //Se obtiene el carrito de la sessión
        let carrito = getSessionValues();

        //Se obtiene el máximo id de los productos en el carrito
        let maxId = carrito
                        .map(prod => prod.id)
                        .reduce(function(acumulador, valorActual)
                        {return Math.max(acumulador, valorActual)}, 0)
        
        //Si el producto a agregar no está en el carrito, se genera una nueva instancia de la clase producto
        if (carrito.find(prod => prod.nombre === producto.nombre) === undefined){
            let nuevoProducto = new Producto(
                maxId,
                producto.nombre, 
                producto.descripcion, 
                producto.imagen, 
                parseInt(producto.precio), 
                parseInt(producto.cantidad), 
            );
            
            //Se calcula el subtotal del producto con el método de la clase
            nuevoProducto.calcularSubtotal();

            //Se agrega el nuevo producto al carrito
            carrito.push(nuevoProducto);
        } else{
            //Si el producto ya estaba en el carrito se recorre el carrtio y cuando nombre del producto sea igual al que queremos agregar se cambia la cantidad y se calcula el subtotal nuevamente
            carrito = carrito.map(prod => {
                if (prod.nombre === producto.nombre){
                    prod.cantidad = prod.cantidad + parseInt(producto.cantidad)
                    prod.subtotal = prod.precio * prod.cantidad;
                }
                
                //Se devuelve el array de productos modificado
                return{...prod}
            })
        }

        //Se muestra un mensaje indicando que el producto fue agregado al carrito de compras
        Swal.fire({
            title: "Agregar producto",
            text: `Se agregado "${producto.nombre}" a su carrito de compras`,
            icon: "success",
            confirmButtonColor: "#ec128f",
            confirmButtonText: "OK",
        });

        //Se actualiza la sessión del usuario con los nuevos valores del carrito
        setSessionValues(carrito);
    }
}


//Función removerCarrito: Se utilizar para remover un producto completo del carrito de compras
function removerCarrito(index) {

    //Se obtiene el carrito de la sessión
    let carrito = getSessionValues();

    //Se quita el item del carrito indicando el índice del elemento a remover
    carrito.splice(index, 1);

    //Se actualiza la sessión del usuario con los nuevos valores del carrito
    setSessionValues(carrito);

    //Se obtiene de la sessión todos los valores necesarios
    getSessionValues();

    //Se actualizan los items del carrito
    actualizarItems();
}

//Función actulaizarItems: Se dejó de utilizar al modiicar la forma en que se visualiza el carrito
// function actualizarItems(){

//     let carrito = getSessionValues();

//     if (carrito.length === 0){
//         carritoVacio();
//     }else{
//         let cartContainer = document.getElementById('td-tabla-carrito');
//         let totalContainer = document.getElementById('total');
//         cartContainer.innerHTML = '';

//         let total = 0;
//         let itemPrecio = 0;
//         let itemSubtotal = 0;

//         carrito.forEach((item, index) => {
//             total += item.precio * item.cantidad;
//             itemSubtotal = formatoMoneda("ARS", item.precio * item.cantidad);
//             itemPrecio = formatoMoneda("ARS", item.precio);
//             let cartItem = document.createElement('tr');
//             cartItem.className = 'item-carrito';
//             cartItem.innerHTML = `
//                 <td><img class="imagen-item-carrito" src="${item.imagen}" alt="${item.nombre}"></td>
//                 <td>${item.nombre}</td>
//                 <td>${itemPrecio}</td>
//                 <td>${item.cantidad}</td>
//                 <td>${itemSubtotal}</td>
//                 <td><button class="btn-del-item" onclick="removerCarrito(${index})">Remover</button></td>
//             `;
//             cartContainer.appendChild(cartItem);
//         });


//         let miTotal = formatoMoneda('ARS', total);

//         let cartTotal = document.createElement('tr');
//         cartTotal.className = 'total-carrito';
//         cartTotal.innerHTML = `
//             <td></td>
//             <td></td>
//             <td></td>
//             <td class="total-carrito-text">Total carrito:</td>
//             <td class="total-carrito-value">${miTotal}</td>
//             <td><button class="btn-comprar" onclick="comprar()">Comprar</button></td>
//         `;
//         cartContainer.appendChild(cartTotal);
//         // totalContainer.textContent = total.toFixed(2);
//     }
// }


//Funciona actualizarItems: genera los items que se van a mostrar en el carito
function actualizarItems(){

    //Se obtienen los valores del carrito desde la sessión
    let carrito = getSessionValues();

    //Si el carrito está vació se muestra una imagen y un mensaje con la función carritoVacio()
    if (carrito.length === 0){
        carritoVacio();
    }else{
        //Se obtienen los elementos "items-productos" e "total-resumen-compra"
        let cartContainer = document.getElementById('items-productos');
        let totalContainer = document.getElementById('total-resumen-compra');

        //Se elimina todo html que contenga el elemento "items-productos"
        cartContainer.innerHTML = '';

        //Se incializan variables
        let total = 0;
        let itemPrecio = 0;
        let itemSubtotal = 0;

        //Para cada item del carrito se calculan los totales y se genera el html de los elementos que va a contener
        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad;
            itemSubtotal = formatoMoneda("ARS", item.precio * item.cantidad);
            let cartItem = document.createElement('div');
            cartItem.className = 'item';
            cartItem.innerHTML = `
                <div class="img-producto">
                    <img class="img-p" src="${item.imagen}" alt="${item.nombre}" width="80" height="80">
                </div>
                <div class="detalle-producto">
                        <p class="desc-p">${item.nombre}</p>
                        <p class="detail-p">${item.descripcion}</p>
                        <a class="btn-remover" href="#" onclick="removerCarrito(${index})">Eliminar</a>
                </div>
                <div class="cantidad-producto">
                    <button class="cantidad-btn btn-less" onclick="cambiarCantidad(-1, ${index})">-</button>
                    <input type="number" id="cantidad-imput${index}" class="cantidad-input" value="${item.cantidad}" min="1">
                    <button class="cantidad-btn btn-more" onclick="cambiarCantidad(1, ${index})">+</button>
                </div>
                <div class="total-producto">
                    <p class="total-p">${itemSubtotal}</p>
                </div>
            `;

            //Se agrega el item al elemento padre
            cartContainer.appendChild(cartItem);

            //Se genera div que se usa de separador entre items, se setea la clase y se agrega al elemento padre
            let itemSeparator = document.createElement('div');
            itemSeparator.className = 'separator-productos';
            cartContainer.appendChild(itemSeparator);
        });

        //Sa da formato de moneda al valor toal de la compra
        let miTotal = formatoMoneda('ARS', total);

        //Se obtiene el elemento donde va el total
        let totalCompra = document.getElementById('total-resumen-compra');
        
        //Se asigna el valor al elemento
        totalCompra.textContent = miTotal;
    }
}

//Funcion cambiarCantidad: Se utiliza para sumar o restar la cantidad de items de un producto en el carrito de compras.
function cambiarCantidad(valor, id) {
    
    //Se obtiene el elemento que contiene la cantidad de items del producto cuyo id (indice) se pasó por parámetro
    let input = document.getElementById(`cantidad-imput${id}`);
    
    //Se suma el valor que se pasó por paráetro a lo que ya tenía el input
    let nuevaCantidad = parseInt(input.value) + valor;

    //Si la cantidad resulta se menor a 0 se deja un mínimo de 1
    if (nuevaCantidad < 1) nuevaCantidad = 1; // Mínimo 1

    //Se asigna el nuevo valor de cantidad al input
    input.value = nuevaCantidad;
    
    //Se obtienen los valores del carrito de la sessión
    let carrito = getSessionValues();

    //Se actualiza el valor de cantidad y se calcula el nuevo subtotal para el producto cuyo id se pasó por parámetro
    carrito[id].cantidad = nuevaCantidad;
    carrito[id].subtotal = carrito[id].cantidad* carrito[id].precio;

    //Se actualiza la sessión con el carrito modificado
    setSessionValues(carrito);

    //Se vuelven a calcular todos los items del carrito
    actualizarItems();
}

//Funcion comprar(): Se dejó de utilizar al modiicar la forma en que se visualiza el carrito
// function comprar(){
//     let carrito = getSessionValues();
//     if (carrito.length == 0){
//         carritoVacio();
//     } else{
//         let retVal = confirm("¿Desea confirmar su compra?");
//         if( retVal == true ){
//             carrito = [];
//             setSessionValues(carrito);
//             alert ("Felicidades, su compra ha sido confirmada");
//             actualizarItems();
//             return true;
//         }else{
//             return false;
//         }
//     }
// }


//Función comprar: Se utiliza para mostrar mensajde confirmación de compra y vaciar el carrito una vez confirmado
function comprar(){
    
    //Se obtiene el carrito de la sessión
    let carrito = getSessionValues();

    //Si el carrito está vacío se ejecuta la función "carritoVacio()"
    if (carrito.length == 0){
        carritoVacio();
    } else{
        //Si no lo está se muestra un mensaje para que el usuario idique si desea confirmar la compra
        Swal.fire({
            title: "Finalizar compra",
            text: "Confirma que desea confirmar su compra?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#ec128f",
            cancelButtonColor: "#888888",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar"
        }).then(async(result)=> {
            if (result.isConfirmed) {
                //Si el usuario presiona "OK" se muestra un nuevo mensaje indicando que la compra fue realizada
                await Swal.fire({
                    title: "Finalizar compra",
                    text: "Felicidades, su compra ha sido confirmada. Gracias por elegirnos",
                    icon: "success",
                    confirmButtonColor: "#ec128f",
                    confirmButtonText: "OK"
                })

                //Se setea un array vacío para la variable que tienen los datos del carrito
                carrito = [];
                
                //Se actualiza la session con el carrito vacío
                setSessionValues(carrito);

                //Se actualizan los items del carrito para quitar todo lo que ya se compró.
                actualizarItems();
            }
        });
    }
}


//Función carritoVacio: Se utiliza para mostrar una imagen y un mensjaje que indican ue no hay productos agregados al carrito
function carritoVacio(){

    //Se obtiene el elmento padre que contiene todos los tiems del carrrito y el resumen el compra
    let cartContainer = document.getElementById('container-compra');

    //Se remueve el elemento completo
    cartContainer.remove();

    //Se obitene el elemento que principal del documento
    let cartSection = document.getElementById('carrito-compra');

    //Se crea un div
    let carritoVacio = document.createElement('div');

    //Se le asigna una clase que se va a utilizar para darle formato
    carritoVacio.className = 'container-carrito-vacio';

    //Se genera el html para agregar una imagen y un párrafo
    carritoVacio.innerHTML = `
        <img src="${baseURL}/assets/empty-cart.png" height=200 width=200>
        <p class="p-carrito-vacio" id="p-carrito-vacio">No hay productos agregados al carrito</p>
    `;

    //Se agrega el item al elemento padre
    cartSection.appendChild(carritoVacio);
}


//Función formatoMoneda: Se utliza para dar formatod de moneda a los precios y totales.
function formatoMoneda(moneda, valor){
    let currencyFormat = new Intl.NumberFormat('es-AR', {style: 'currency', minimumFractionDigits: 2, currency: moneda});
    return currencyFormat.format(valor);
}


//Función listadoProductos: Se utiliza para obtener un listado de productos que se encuentra en un archivo json
async function listadoProcductos(){
    try{
        let response = await fetch("../json/productos.json");
        let data = await response.json();
        return data;
    }catch(error){
        console.error("Ha ocurrido un error", error);
    }
}


//Función mostrarProductos: Se utiliza para mostrar los productos obtendios generando dinámicamente una tabla.
async function mostrarProductos(){
    
    //Se obtienen los productos con la función listaodProductos()
    let productos = await listadoProcductos();

    //Se obtienen el elemento padre en el cual se va a generar la tabla
    let divProductos = document.getElementById("container-listado-productos");
    
    //Se inicializan algunas variables
    let divTablaProductos = "";
    let bodyTabla = "";
    let itemCantidad = "";

    //Si la ista de productos está vacía se genera un elemento h2 y se muestra el text indicando que no hay productos para mostrar
    if (productos.length === 0){
        let noProductsMessage = document.createElement("h2");
        noProductsMessage.className = "no-products-message";
        noProductsMessage.textContent = "No se encontraron productos para mostrar";
        divProductos.appendChild(noProductsMessage);
    }else{
        //Si hay producots se crea un div, se le agregan el html para generar una tabla detallando los headers y el body sin ningún detalle de momento
        divTablaProductos = document.createElement("div");
        divTablaProductos.className = "container-tabla-productos";
        divTablaProductos.innerHTML = `
            <table class="tabla-productos" id="tabla-productos">
                <thead>          
                    <tr id="row-title">
                        <th class="th-listProd-nombre">Producto</th>
                        <th class="th-listProd-descripcion">Descripcion</th>
                        <th class="th-listProd-precio-lista">Precio Lista</th>
                        <th class="th-listProd-precio-oferta">Precio Oferta</th>
                        <th class="th-listProd-cantidad">Cantidad</th>
                    </tr>
                </thead>
                <tbody id="td-tabla-productos">

                </tbody>
            </table>
        `;

        //Se agrega todo el contenido generado al elemento padre
        divProductos.appendChild(divTablaProductos);
        
        //Se obtiene el elemento anteriormente creado para el body
        bodyTabla = document.getElementById("td-tabla-productos");

        //Se recorren el array de objetos productos, se setean la variables de cantidad, cantidad item, precio, etc y se genrea una fila para volvar todos los datos.
        productos.forEach((item, index) => {
            if (item.cantidad > 0){
                itemCantidad = item.cantidad;
            }else{
                itemCantidad = "<img class='img-agotado' src='../assets/agotado_icon.png' alt='Producto Agotado'>"
            }
            let prodItem = document.createElement("tr");
            let precioOferta = "";
            if (item.precio_oferta === 0){
                precioOferta = "-";
            }else{
                precioOferta = formatoMoneda("ARS",item.precio_oferta);
            }
            prodItem.className = "item-producto";
            prodItem.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.descripcion}</td>
            <td>${formatoMoneda("ARS", item.precio_lista)}</td>
            <td>${precioOferta}</td>
            <td>${itemCantidad}</td>
            `;
            bodyTabla.appendChild(prodItem);
        });
    }
}

