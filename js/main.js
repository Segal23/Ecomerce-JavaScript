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

            window.location.href = "./html/main_page.html";
            //para poner esta referencia hay que tener en cuenta como si se estuviera llamando desde el html en el que estamos (en este caso en el index.html) y no como si estuvieramos en el script porque si bien acá funciona en Github no toma la referencia y no encuentra la página.
        } else {
                message.textContent = "Usuario o contraseña incorrectos.";
            };

    }
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
                // parseInt(producto.subtotal)
            );
            nuevoProducto.calcularSubtotal();
            console.log(nuevoProducto.id);
            carrito.push(nuevoProducto);
            console.log(carrito);
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
        var retVal = confirm("¿Desea confirmar su compra?");
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