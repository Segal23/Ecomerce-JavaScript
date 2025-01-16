function login(){

    // Usuarios registrados
    let usuarios = [
        {nombre: "Sebastián", apellido: "Gallegos", edad: "47", usuario: "segal", clave: "segal#01"}
    ];
    
    // Obtener valores del formulario
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let message = document.getElementById('message');
    
    // Validar credenciales
    for (let i = 0; i <= usuarios.length-1; i++){
    
        if (username == usuarios[0].usuario && password == usuarios[0].clave){
            message.textContent = "";
            
            let nombre = usuarios[i].nombre;
            sessionStorage.setItem("nombre", nombre);
            
            let apellido = usuarios[i].apellido
            sessionStorage.setItem("apellido", apellido);
    
            window.location.href = "../html/main_page.html";
            // let welcomeMessage= document.getElementById('welcome-message')
            // welcomeMessage.textContent = "Bienvenido " + usuarios[i].nombre + " " + usuarios[i].apellido + "!!!";
            } else {
                message.textContent = "Usuario o contraseña incorrectos.";
            };
    
    }
}


let carrito = [];
let carritoAgrupado = [];
let cantItems = 0;
let totalItems = 0;

function setSessionValues(arrayCarrito=null){
    if (arrayCarrito !== null){
        sessionStorage.setItem("miCarrito", JSON.stringify(arrayCarrito)); 
    } else {
        sessionStorage.setItem("miCarrito", JSON.stringify(carrito));
    }

    if(JSON.parse(sessionStorage.getItem("miCarrito")) !== null){
        carrito = JSON.parse(sessionStorage.getItem("miCarrito"));  
    }  

    cantItems = 0;
    totalItems = 0;

    for (let i = 0; i < carrito.length; i++){
        cantItems += parseInt(carrito[i].cantidad);
        totalItems  += (parseInt(carrito[i].precio) * parseInt(carrito[i].cantidad)) ;
    }

    sessionStorage.setItem("items", cantItems);
    sessionStorage.setItem("total", totalItems);
}

function getSessionValues(){
    if(JSON.parse(sessionStorage.getItem("miCarrito")) !== null){
        carrito = JSON.parse(sessionStorage.getItem("miCarrito"));  
    }  

    cantItems = sessionStorage.getItem("items");
    totalItems = sessionStorage.getItem("total");

    let itemsCont = document.getElementById('items');
    let totalCont = document.getElementById('total');

    if (cantItems == null) {
        cantItems = 0;
    }

    itemsCont.textContent = cantItems;

    if (totalItems == null) {
        totalItems = 0
    }
        totalCont.textContent = formatoMoneda("ARS", totalItems);
    
}

function addCarrito(producto) {
    if (parseInt(producto.cantidad) > 0 ){
        carrito.push(producto);
        setSessionValues();
        getSessionValues();
    }else{
        alert("La cantidad del producto debe ser mayor a 0");
    }
}

function removerCarrito(index) {
    let newCarrito = [];
    let idProducto = carritoAgrupado[index].id;

    for (let i = 0; i < carrito.length; i++){
        if (carrito[i].id !== idProducto){
            newCarrito.push(carrito[i]);
        };
    };

    carritoAgrupado.splice(index,1);
    
    setSessionValues(newCarrito)
    getSessionValues();
    actualizarItems();
}

function agruparItems(){
    let newCarrito = carrito;
    let res = newCarrito.reduce((p, c) => {
        let idx = p[0].indexOf(c.id);
        if (idx > -1) {
            p[1][idx].cantidad = parseInt(p[1][idx].cantidad) + parseInt(c.cantidad);
            // p[1][idx].precio += parseInt(c.precio);
        } else {
            p[0].push(c.id);
            p[1].push(c);
        }
        return p;
    }, [[],[]]);

carritoAgrupado = res[1];
}

function actualizarItems(){
    if (carritoAgrupado.length == 0){
        carritoVacio();
    }else{
        let cartContainer = document.getElementById('td-tabla-carrito');
        let totalContainer = document.getElementById('total');
        cartContainer.innerHTML = '';

        let total = 0;
        let itemPrecio = 0;
        let itemSubtotal = 0;

        carritoAgrupado.forEach((item, index) => {
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
    if (carritoAgrupado.length == 0){
        carritoVacio();
    } else{
        var retVal = confirm("¿Desea confirmar su compra?");
        if( retVal == true ){
            carrito = [];
            carritoAgrupado = [];
            setSessionValues();
            getSessionValues();
            agruparItems();
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