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

function password_show_hide(id) {
    let showId = "show_eye";
    let hideId = "hide_eye";

    if (id === "confirm-password"){
        showId = "show_eye2";
        hideId = "hide_eye2";
    }

    let x = document.getElementById(id);
    let show_eye = document.getElementById(`${showId}`);
    let hide_eye = document.getElementById(`${hideId}`);

    hide_eye.classList.remove("d-none");
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


function showToast(message) {

    //Si hay un toast activo sale de la función para no mostrar otro
    if (sessionStorage.getItem("activeToast") === "true") {
        return;
    }

    //Genero el nuevo toast con el error pasado por parámetro
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

    //Transcurrido el tiempo de duración del toast se elimina de los datos de la sesión
    setTimeout(() => {
        sessionStorage.removeItem("activeToast");
    }, 2100);
}

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
    let usuariosRegistrados = JSON.parse(sessionStorage.getItem('Usuarios'));

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

        //Cuando pasa por el input "password" se guardo el valor
        if (input.name ==="password"){
            password = input.value;
        }

        //Cuando pasa por el campo "confirm-password" verifica si el valor es igual al del input "password" guadado previamente y si no lo es muestra una notificación
        if(input.name ==="confirm-password" && input.value !== password ){
            showToast("El password y el confirm password deben ser iguales");
            camposConError = true;
            if (inputName ===""){
                inputName = input.name;
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
    sessionStorage.setItem("Usuarios", JSON.stringify(usuarios));

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

    window.location = `${window.origin}/html/login.html`;
}

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
        loginIcon.src = `${window.origin}/assets/logout_icon.png";`
        loginIcon.alt = "Cerrar Sesión";
        loginDropDownListItem.innerHTML = `
            <a class="dropdown-item" href="#" onclick="cerrarSesion()">Cerrar Sesión</a>`;
    } else{
        loginIcon.src = `${window.origin}/assets/login_icon.png`;
        loginIcon.alt = "Iniciar Sesión";
        loginDropDownListItem.innerHTML = `
            <a class="dropdown-item" href="${window.origin}/html/login.html">Iniciar Sesión</a>
            <a class="dropdown-item" href="${window.origin}/html/signup.html">Registrarse</a>`;
    }

    //Se agrega un height y un width al img creado y se agrega el item al padre que lo va a contener
    loginIcon.height = "35";
    loginIcon.width = "35";
    loginlink.appendChild(loginIcon);
    loginDropDown.appendChild(loginDropDownListItem);
}

async function iniciarSesion(){

    try{

        //Se declara un array vacío
        let usuarios = [];

        //Se traen los usuarios guardados en el sessionStorage
        let usuariosRegistrados = JSON.parse(sessionStorage.getItem('Usuarios'));

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
            if (document.referrer !== `${window.origin}/html/signup.html`){
                window.history.go(-1);
            }else{
                window.location = `${window.origin}/index.html`;
            }
            

        } else{
            showToast("Usuario o contraseña incorrectos");
            username.value = "";
            password.value = "";
        }
    }catch(error){
        console.error("Ha ocurrido un error", error);
    }
}


function cerrarSesion(){
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
            Swal.fire({
                title: "Sessión finalizada",
                text: "Usted ha cerrado su sessión correctamente ",
                icon: "success",
                confirmButtonColor: "#ec128f",
            });
            sessionStorage.removeItem("datosUsuarioActual");
            let nombreUsuario = document.getElementById('usuario-logueado');
            nombreUsuario.textContent = ""  ;
            setSesionUsuario()
        }
    });
}

function getSessionValues(){
    let carrito = JSON.parse(sessionStorage.getItem("miCarrito"));
        if (carrito === null) {
            carrito = [];
        }
        return carrito;
}

function setSessionValues(carrito=null){
    let cantItems = 0;
    let totalItems = 0;
    
    if (carrito === null){
        carrito = getSessionValues();
    } else{
        sessionStorage.setItem("miCarrito", JSON.stringify(carrito));
    }

    cantItems = carrito
                    .map(prod => prod.cantidad)
                    .reduce(function(acumulador, valorActual)
                    {return acumulador + valorActual;}, 0)

    totalItems = carrito
                    .map(prod => prod.subtotal)
                    .reduce(function(acumulador, valorActual)
                    {return acumulador + valorActual;}, 0)

    document.getElementById('items').textContent = cantItems ?? 0;
    document.getElementById('total').textContent = formatoMoneda("ARS", totalItems ?? 0);
}

function addCarrito(producto) {
    if (parseInt(producto.cantidad) <= 0 ){
        alert("La cantidad del producto debe ser mayor a 0");      
    }else{
        let carrito = getSessionValues();
        let maxId = carrito
                        .map(prod => prod.id)
                        .reduce(function(acumulador, valorActual)
                        {return Math.max(acumulador, valorActual)}, 0)
        
        if (carrito.find(prod => prod.nombre === producto.nombre) === undefined){
            let nuevoProducto = new Producto(
                maxId,
                producto.nombre, 
                producto.descripcion, 
                producto.imagen, 
                parseInt(producto.precio), 
                parseInt(producto.cantidad), 
            );
            nuevoProducto.calcularSubtotal();
            carrito.push(nuevoProducto);
        } else{
            carrito = carrito.map(prod => {
                if (prod.nombre === producto.nombre){
                    prod.cantidad = prod.cantidad + parseInt(producto.cantidad)
                    prod.subtotal = prod.precio * prod.cantidad;
                }
                return{...prod}
            })
        }
        setSessionValues(carrito);
    }
}

function removerCarrito(index) {
    let carrito = getSessionValues();
    carrito.splice(index, 1);
    setSessionValues(carrito)
    getSessionValues();
    actualizarItems();
}

function actualizarItems(){

    let carrito = getSessionValues();

    if (carrito.length === 0){
        carritoVacio();
    }else{
        let cartContainer = document.getElementById('td-tabla-carrito');
        let totalContainer = document.getElementById('total');
        cartContainer.innerHTML = '';

        let total = 0;
        let itemPrecio = 0;
        let itemSubtotal = 0;

        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad;
            itemSubtotal = formatoMoneda("ARS", item.precio * item.cantidad);
            itemPrecio = formatoMoneda("ARS", item.precio);
            let cartItem = document.createElement('tr');
            cartItem.className = 'item-carrito';
            cartItem.innerHTML = `
                <td><img class="imagen-item-carrito" src="${item.imagen}" alt="${item.nombre}"></td>
                <td>${item.nombre}</td>
                <td>${itemPrecio}</td>
                <td>${item.cantidad}</td>
                <td>${itemSubtotal}</td>
                <td><button class="btn-del-item" onclick="removerCarrito(${index})">Remover</button></td>
            `;
            cartContainer.appendChild(cartItem);
        });


        let miTotal = formatoMoneda('ARS', total);

        let cartTotal = document.createElement('tr');
        cartTotal.className = 'total-carrito';
        cartTotal.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td class="total-carrito-text">Total carrito:</td>
            <td class="total-carrito-value">${miTotal}</td>
            <td><button class="btn-comprar" onclick="comprar()">Comprar</button></td>
        `;
        cartContainer.appendChild(cartTotal);
        // totalContainer.textContent = total.toFixed(2);
    }
}

function comprar(){
    let carrito = getSessionValues();
    if (carrito.length == 0){
        carritoVacio();
    } else{
        let retVal = confirm("¿Desea confirmar su compra?");
        if( retVal == true ){
            carrito = [];
            setSessionValues(carrito);
            // getSessionValues();
            alert ("Felicidades, su compra ha sido confirmada");
            actualizarItems();
            return true;
        }else{
            return false;
        }
    }
}

function carritoVacio(){
    let cartContainer = document.getElementById('container-tabla-carrito');
    cartContainer.remove();

    let containerCarritoVacio = document.getElementById('container-carrito-vacio');
    containerCarritoVacio.style.backgroundColor = "limegreen";

    let textCarritoVacio = document.getElementById('p-carrito-vacio');
    textCarritoVacio.textContent = "El carrito está vació";
}

function formatoMoneda(moneda, valor){
    let currencyFormat = new Intl.NumberFormat('en-es', {style: 'currency', minimumFractionDigits: 2, currency: moneda});
    return currencyFormat.format(valor);
}

async function listadoProcductos(){
    try{
        let response = await fetch("../json/productos.json");
        let data = await response.json();
        return data;
    }catch(error){
        console.error("Ha ocurrido un error", error);
    }
}

async function mostrarProductos(){
    let productos = await listadoProcductos();
    let divProductos = document.getElementById("container-listado-productos");
    let divTablaProductos = "";
    let bodyTabla = "";
    let itemCantidad = "";

    console.log(productos);
    if (productos.length === 0){
        let noProductsMessage = document.createElement("h2");
        noProductsMessage.className = "no-products-message";
        noProductsMessage.textContent = "No se encontraron productos para mostrar";
        divProductos.appendChild(noProductsMessage);
    }else{
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

        divProductos.appendChild(divTablaProductos);
        
        bodyTabla = document.getElementById("td-tabla-productos");
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

