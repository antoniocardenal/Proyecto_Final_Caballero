// Precio por noche para cada tipo de habitación
const preciosPorNoche = {
  estandar: 750,
  deluxe: 1500,
  suite: 2000
};

// Array para almacenar las reservas
let reservas = [];

// Función para calcular el costo total de una reserva
function calcularCostoReserva(cantidadNoches, tipoHabitacion) {
  if (tipoHabitacion in preciosPorNoche) {
    return preciosPorNoche[tipoHabitacion] * cantidadNoches;
  } else {
    return 0;
  }
}

async function cargarReservasDesdeJSON() {
  try {
    const response = await fetch('reservas.json');
    if (!response.ok) {
      throw new Error('Error al cargar datos.');
    }
    const data = await response.json();
    reservas = data;
    mostrarReservas();
  } catch (error) {
    console.error(error);
  }
}

function guardarReservasEnStorage() {
  const reservasJSON = JSON.stringify(reservas);
  localStorage.setItem('reservas', reservasJSON);
}

cargarReservasDesdeJSON();

function mostrarReservas() {
  const listaReservas = document.getElementById('lista-reservas');
  listaReservas.innerHTML = '';

  let costoTotal = 0;

  reservas.forEach((reserva, index) => {
    const costoReserva = calcularCostoReserva(reserva.cantidadNoches, reserva.tipoHabitacion);
    costoTotal += costoReserva;
    const itemReserva = document.createElement('li');
    itemReserva.textContent = `Reserva ${index + 1} - ${reserva.cantidadNoches} noches en ${reserva.tipoHabitacion.charAt(0).toUpperCase() + reserva.tipoHabitacion.slice(1)} - Costo: $${costoReserva}MXN`;
    listaReservas.appendChild(itemReserva);
  });

  // Costo total de las reservas
  const costoTotalElement = document.getElementById('costo-total');
  costoTotalElement.textContent = `Costo total de todas las reservas: $${costoTotal}MXN`;
}


cargarReservasDesdeJSON();


function limpiarHistorial() {
  localStorage.removeItem('reservas');
  reservas.length = 0;
  mostrarReservas();
}

// Evento para realizar una reserva
const botonReservar = document.getElementById('boton-reservar');
botonReservar.addEventListener('click', () => {
  const cantidadNoches = parseInt(document.getElementById('cantidad-noches').value);
  const tipoHabitacion = document.getElementById('tipo-habitacion').value;
  const costoReserva = calcularCostoReserva(cantidadNoches, tipoHabitacion);

  if (costoReserva > 0) {
    reservas.push({ cantidadNoches, tipoHabitacion });
    guardarReservasEnStorage();
    mostrarReservas();

    mostrarNotificacion('Reserva exitosa: ¡Tu habitación ha sido reservada!');
  } else {
    mostrarNotificacion('No se pudo realizar la reserva. Por favor, verifica la información.');
  }
});

// Evento para limpiar el historial de reservas
const botonLimpiar = document.getElementById('boton-limpiar');
botonLimpiar.addEventListener('click', () => {
  limpiarHistorial();
  mostrarNotificacion('El historial de reservas se ha limpiado con éxito.');
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
  const notificacionElement = document.getElementById('notificacion');
  notificacionElement.textContent = mensaje;

  setTimeout(() => {
    notificacionElement.textContent = '';
  }, 3000); // Notificación visible durante 3 segundos
}

//Alerta borrar historial de reserva
botonLimpiar.addEventListener ('click', () => {

Swal.fire({
  title:'¿Deseas borrar el historial de reservas?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Sí',
  cancelButtonText: 'No'
}).then((result) => {

  if (result.isConfirmed) {
      Swal.fire({
          title: 'Borrado!',
          icon: 'success',
          text: 'No hay reservas'
      })
  }
})
})

// Actualizar costo total de las reservas
function actualizarCostoTotal() {
  let costoTotal = 0;
  reservas.forEach(reserva => {
    costoTotal += calcularCostoReserva(reserva.cantidadNoches, reserva.tipoHabitacion);
  });
  const costoTotalElement = document.getElementById('costo-total');
  costoTotalElement.textContent = `Costo total de todas las reservas: $${costoTotal}MXN`;
}

// Función para calcular costo de reserva por tipo de habitación
function sumarCantidadesPorTipo() {
  const cantidadesPorTipo = {};

  reservas.forEach((reserva) => {
    const tipoHabitacion = reserva.tipoHabitacion;
    if (cantidadesPorTipo[tipoHabitacion]) {
      cantidadesPorTipo[tipoHabitacion] += 1;
    } else {
      cantidadesPorTipo[tipoHabitacion] = 1;
    }
  });

  return cantidadesPorTipo;
}