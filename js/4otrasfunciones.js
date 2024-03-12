// otrasfunciones.js

// Agregar evento de clic a cada tarjeta para la selección/deselección
const tarjetas = document.querySelectorAll(".tarjeta");
tarjetas.forEach(tarjeta => {
  tarjeta.addEventListener("click", () => {
    // Deseleccionar todas las tarjetas
    tarjetas.forEach(t => t.classList.remove("seleccionada"));
    // Seleccionar la tarjeta clicada
    tarjeta.classList.add("seleccionada");
  });
});

// Definir la función para marcar un turno como terminado
async function marcarTerminado(i) {
  const filaAEditar = 0; // Define filaAEditar según sea necesario
  const updateTurno = turnos[i];
  updateTurno.comentario = comentarioElement.value;
  const res = await editTurno(updateTurno.id, updateTurno, filaAEditar);
  if (res.status === 200) {
    turnos = turnos.filter(turno => turno.id !== updateTurno.id);
    indiceSeleccionado = 0;

    // Ocultar las tarjetas marcadas
    Array.from(turnosContainer.children).forEach((tarjeta, index) => {
      if (index === indiceSeleccionado) {
        tarjeta.classList.toggle("seleccionado", false);
      }
    });

    await actualizarTarjetas();
    detalleContainer.classList.toggle("escondido", true);
    comentarioElement.value = "";
  }
}

async function marcarTerminado(i) {
  const updateTurno = turnos[i];
  updateTurno.comentario = comentarioElement.value;

  try {
      const res = await editTurno(updateTurno.id, updateTurno, updateTurno.fila);

      if (res && res.status === 200) {
          turnos = turnos.filter(turno => turno.id !== updateTurno.id);
          indiceSeleccionado = 0;

          Array.from(turnosContainer.children).forEach((tarjeta, index) => {
              if (index === indiceSeleccionado) {
                  tarjeta.classList.toggle("seleccionado", false);
              }
          });

          await actualizarTarjetas();
          detalleContainer.classList.toggle("escondido", true);
          comentarioElement.value = "";
      }
  } catch (err) {
      console.error(err);
  }
}


export { marcarTerminado };