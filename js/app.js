const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

eventListener()
function eventListener(){
    document.addEventListener('DOMContentLoaded', pregutarPresupuesto );
    formulario.addEventListener('submit', agregarGasto);
}

class Presupuesto {
    constructor(presupuesto){
           this.presupuesto = Number(presupuesto);
           this.restante = Number(presupuesto);
           this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}

class UI { 
    insertarPresupuesto(cantidad){
        const{presupuesto, restante} = cantidad
    
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const mensajeValidacion = document.createElement('div');
        mensajeValidacion.classList.add('text-center', 'alert');

        if(tipo === "error"){
            mensajeValidacion.classList.add('alert-danger');
        } else {
            mensajeValidacion.classList.add('alert-success');
        }

        mensajeValidacion.textContent = mensaje

        document.querySelector('.primario').insertBefore(mensajeValidacion, formulario);

        setTimeout( () => {
            mensajeValidacion.remove()
        }, 3000)
    }

    mostrarGastos(gastos){

        this.limpiarHTML();50

        gastos.forEach( gasto => {
            
            const{ cantidad, nombre, id} = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>`

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar X'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);

        });
    }

    actualizarrestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDIV = document.querySelector('.restante');

        if((presupuesto / 4) > restante ){
            restanteDIV.classList.remove('alert-success', 'alert-warning');
            restanteDIV.classList.add('alert-danger');
        } else if((presupuesto / 2) > restante){
            restanteDIV.classList.remove('alert-success', 'alert-danger');
            restanteDIV.classList.add('alert-warning');
        } else {
            restanteDIV.classList.remove('alert-warning', 'alert-danger');
            restanteDIV.classList.add('alert-success');
        }

        if(restante <= 0 ){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }

    limpiarHTML(){
        while( gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

}

const ui = new UI()
let presupuesto;


function pregutarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?")

    if( presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario)

    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto(e){
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;    
    const cantidad = Number(document.querySelector('#cantidad').value);  
    
    if((nombre && cantidad) === "" ){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error' );   
        return;    
    } else if (isNaN(cantidad) || cantidad <= 0 ){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    const gasto = {nombre, cantidad, id: Date.now()};

    presupuesto.nuevoGasto( gasto );

    ui.imprimirAlerta('Gasto agregado');

    ui.mostrarGastos(presupuesto.gastos);

    ui.actualizarrestante(presupuesto.restante);

    ui.comprobarPresupuesto(presupuesto);

    formulario.reset();
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);

    ui.mostrarGastos(presupuesto.gastos);
    ui.actualizarrestante(presupuesto.restante);
    ui.comprobarPresupuesto(presupuesto);
}