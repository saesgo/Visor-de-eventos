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
finalizar.addEventListener("click", () => marcarTerminado(indiceSeleccionado));
