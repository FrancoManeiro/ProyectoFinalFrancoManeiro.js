// declaraciones
// ------------
let allServicios = []
let carrito

if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
} else {
    carrito = []
}


// query de elementos
// -----------
const serviciosList = document.querySelector('#serviciosList')
const botonComprar = document.querySelector('#botoncomprar');
const imgGrande = document.querySelector(".imgGrande");
const textDesc = document.querySelector(".textDesc");
const buttonGrande = document.querySelector(".buttonGrande");
const verCarrito = document.querySelector("#verCarrito");
const carritoConServicios = document.querySelector("#carritoConServicios")
const totalContent = document.querySelector("#totalContent");
const modalContainer = document.querySelector("#modalContainer");
const cantidadCarrito = document.querySelector("#cantidadCarrito");

// funciones
// --------------
const renderizarDatosServicios = (e) => {
    const idServicioElegido = (e.target.closest('.col').getAttribute('data-id'));
    const servicioElegido = allServicios.find((servicio) => servicio.id == idServicioElegido)

    imgGrande.setAttribute('src', servicioElegido.img);
    textDesc.textContent = servicioElegido.descripcion;

    buttonGrande.setAttribute("data-id", servicioElegido.id)
}

const renderizarListaServicios = () => {
    allServicios.forEach((servicio) => {
        const servicioButton = document.createElement("button");
    servicioButton.classList.add("col");
    servicioButton.setAttribute("data-id", servicio.id);
    servicioButton.innerHTML = `
    <div class="p-3 border bg-light">${servicio.nombre}
        <img class="listaAtencion" src="${servicio.img}" alt="${servicio.alt}">
        <p> ${servicio.precio} $ </p>
    </div>
    `;

    serviciosList.append(servicioButton);
    });
    const serviciosButtons = document.querySelectorAll('.col')
    serviciosButtons.forEach((button) =>{
        button.addEventListener("click", renderizarDatosServicios)
    })
}

const agregarServicioCarrito = (e) => {
    const idServicioElegido = e.target.getAttribute("data-id");
    const servicioElegido = allServicios.find((servicio) => servicio.id == idServicioElegido);

    if(!carrito.some((servicio) => servicio.id === idServicioElegido)) {
        carrito.push (servicioElegido);
    } else {
        const servicioSeleccionado = carrito.find((servicio) => servicio.id == idServicioElegido)
        servicioSeleccionado.cantidad++;
    }
    
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Agregado al carrito',
        showConfirmButton: false,
        timer: 800
      });
    carritoCounter();
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
}

const eliminarServicio = (id) => {
    const idServicioElegido = carrito.find((element) => element.id === id);
    carrito = carrito.filter((carritoId) => {
        return carritoId !== idServicioElegido;
    });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarritoDeCompra();
    carritoCounter();
}


const mostrarCarritoDeCompra = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    const modalheader = document.createElement("div");
    modalheader.className = "modal-header";
    modalheader.innerHTML = `
      <h1 class="modal-header-title">Carrito.</h1>
    `;
    modalContainer.append(modalheader);

    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "x";
    modalbutton.className = "modal-header-button";

    modalbutton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    modalheader.append(modalbutton);

    carrito.forEach((product) => {
        let carritoContent = document.createElement("div");
        carritoContent.className = "modal-content";
        carritoContent.innerHTML = `
         <img src="${product.img}">
         <h3>${product.nombre}</h3>
         <p>${product.precio} $</p>
         <span class="restar"> - </span>
         <p>Cantidad: ${product.cantidad}</p>
         <span class="sumar"> + </span>
         <p>Total: ${product.cantidad * product.precio}</p>
         <span class="botonEliminar"> ❌ </span>

         `;

        modalContainer.append(carritoContent);


        let restar = carritoContent.querySelector(".restar");

        restar.addEventListener("click", () => {
            if (product.cantidad >1) {
                product.cantidad--
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarritoDeCompra();
        });

        let sumar = carritoContent.querySelector(".sumar");

        sumar.addEventListener("click", () => {
            product.cantidad++;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarritoDeCompra();
        });

        let eliminar = carritoContent.querySelector(".botonEliminar");

        eliminar.addEventListener("click", () => {
            eliminarServicio(product.id);
        });
    });
    
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

    const totalBuying = document.createElement("h4");
    totalBuying.className = "total-content";
    totalBuying.innerHTML = `Total a pagar: ${total} $`;

    modalContainer.append(totalBuying);

    let buttonVaciar = document.createElement("h5");
    buttonVaciar.innerHTML = "🚫Vaciar Carrito";
    buttonVaciar.className = "botonVaciar";
    modalContainer.append(buttonVaciar);

    buttonVaciar.addEventListener("click", () =>{
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarritoDeCompra();
        carritoCounter();
    });

    let botonComprar = document.createElement("h5");
    botonComprar.innerHTML = "✅Finalizar Compra";
    botonComprar.className = "botonComprar";
    modalContainer.append(botonComprar);

    botonComprar.addEventListener("click", () =>{
        
      if(carrito.length > 0){
        Swal.fire({
            title: 'Desea finalizar su compra?',
            text: "Esta acción no puede cancelarse una vez realizada!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, comprar!'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'MUCHAS GRACIAS!',
                    'Su compra ha sido realizada.',
                    'success'
                  )
                carrito = [];
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarritoDeCompra();
                carritoCounter();
                modalContainer.style.display = "none";
            };
          });
      }else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, el carrito se encuentra vacío!',
          });
      };
    
    });
    
};


const carritoCounter = () => {
    cantidadCarrito.style.display = "block";
    
    const carritoLength = carrito.length;
    localStorage.setItem("carritoLength", JSON.stringify(carritoLength));
    cantidadCarrito.innerHTML = JSON.parse(localStorage.getItem("carritoLength"));
    
};
carritoCounter();

// EventListener
// -----------
verCarrito.addEventListener("click", mostrarCarritoDeCompra);
buttonGrande.addEventListener ("click", agregarServicioCarrito);


// ejecuciones
// ---------
fetch('./json/data.json')
    .then((response) => response.json())
    .then((data) => {
        allServicios = data;
        renderizarListaServicios();
    })


