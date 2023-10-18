
let cosechadores = []
const tarifaPorKilo = 55;
const dolarUrl = "https://dolarapi.com/v1/dolares/blue"
let dolarPrecio = 0

const cargarDolares = async () => {
    const dolarJson = await fetch(dolarUrl)
    const dolar = await dolarJson.json()
    dolarPrecio = await dolar.venta
    const cajaDolar = document.getElementById("dolar")
    cajaDolar.innerHTML = dolarPrecio
    calc3()
}

cargarDolares()

function cargarDatos(array) {
    seccion.textContent = "";
    array.forEach((element) => {
        let caja = document.createElement("div");
        caja.innerHTML = `<h2>Nombre: ${element.nombre}</h2><br>
                            <p>Kilos: ${element.kilos.join(" / ")}</p><br>
                            <p>Total Kilos: ${element.totalKilos}</p><br> 
                            <p>Total a Pagar: $${element.aPagar}</p><br>
                            <p>Total a Pagar en Dolares: $${element.cancelado}</p><br>
                            <input type="number" id="${element.nombre}kilos">
                            <button onclick="cargarKilos('${element.nombre}')">Cargar Kilos</button>`;
        seccion.appendChild(caja);
    });
    cargarDolares()
    calc1()
    calc2()
    calc3()
}

function cosechador(nombre, kilos, totalKilos, aPagar, cancelado) {
    this.nombre = nombre;
    this.kilos = kilos;
    this.totalKilos = totalKilos;
    this.aPagar = aPagar;
    this.cancelado = cancelado;

    this.cargarKilos = function (kilosCargados) {
        if (!isNaN(kilosCargados) && kilosCargados > 0) {
            this.kilos.push(kilosCargados);
            this.totalKilos += kilosCargados;
            this.aPagar = calcularTotalAPagar(this.totalKilos);
            this.cancelado = Math.floor(this.aPagar / dolarPrecio)
        }
    };

    function calcularTotalAPagar(totalKilos) {
        return totalKilos * tarifaPorKilo;
    }
}

function cargarKilos(nombre) {
    const inputId = `${nombre}kilos`;
    const inputElement = document.getElementById(inputId);

    if (inputElement) {
        const kilos = parseFloat(inputElement.value);

        const cosechador = cosechadores.find((element) => element.nombre === nombre);

        if (cosechador) {
            cosechador.cargarKilos(kilos);

        }
    }
    let listaJson = JSON.stringify(cosechadores)
    localStorage.setItem("lista2", listaJson)
    cargarDatos(cosechadores)
}


if (localStorage.getItem("lista2")) {
    let listaJson = localStorage.getItem("lista2")
    let cosechadoresJson = []
    cosechadoresJson = JSON.parse(listaJson)
    cosechadoresJson.forEach((el) => {
        let cosechadorNuevo = new cosechador(el.nombre, el.kilos, el.totalKilos, el.aPagar, el.cancelado)
        cosechadores.push(cosechadorNuevo)
    })
} else {
    cosechadores = []
}



const seccion = document.getElementById("cajaCosechadores")


let borrar = document.getElementById("borrador")
borrar.addEventListener("click", () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: '¿Estas seguro de borrar todos los datos?',
        text: "Se perdera el registro de todos los cosechadores",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, borrar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            location.reload()
            swalWithBootstrapButtons.fire(
                'Datos Borrados!',
                'Todos los datos han sido borrados.',
                'success'
            )

        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'Los datos no han sido borrados.',
                'error'
            )
        }
    })
})

function calc1() {
    const sumaTotal = cosechadores.reduce(function (acc, el) {
        return acc + el.totalKilos;
    }, 0);

    let caja1 = document.getElementById("info1")
    caja1.innerText = `${sumaTotal}Kgs`
}

function calc2() {
    const sumaTotal = cosechadores.reduce(function (acc, el) {
        return acc + el.aPagar;
    }, 0);

    let caja1 = document.getElementById("info2")
    caja1.innerText = `$${sumaTotal}`
}

function calc3() {
    const sumaTotal = cosechadores.reduce(function (acc, el) {
        return acc + el.cancelado;
    }, 0);

    let caja1 = document.getElementById("info3")
    caja1.innerText = `$${sumaTotal}`
}

let formulario = document.querySelector("form")
formulario.addEventListener("submit", (e) => {
    e.preventDefault()
    let cajaTexto = document.getElementById("textoNombre").value.toUpperCase()
    let cosech = new cosechador(cajaTexto, [], 0, 0, 0)
    cosechadores.push(cosech)
    let listaJson = JSON.stringify(cosechadores)
    localStorage.setItem("lista2", listaJson)
    Swal.fire("Cosechador/a " + cajaTexto + " agregado a la lista!" )
    cargarDatos(cosechadores)
    formulario.reset()
})

cargarDatos(cosechadores)

const busc = document.getElementById("textoBuscador")
busc.addEventListener("input", () => {
    let InputValue = busc.value.toUpperCase().trim()

    if(InputValue == ""){
        cargarDatos(cosechadores)
    }else{
        let cosechadoresBuscados = cosechadores.filter(cosechador => cosechador.nombre.includes(InputValue))
        if(cosechadoresBuscados.length > 0){
            cargarDatos(cosechadoresBuscados)
        } else {
            Swal.fire({
                title: "Error",
                text: "No se encontraron cosechadores con ese nombre",
                icon: "error"
            })
            cargarDatos(cosechadores)
            busc.value = ""
        }
    }
})