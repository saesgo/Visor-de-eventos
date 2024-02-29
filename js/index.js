const turnosContainer = document.getElementById("turnosContainer");
const detalleContainer = document.getElementById("detalleContainer");
let indiceSeleccionado;
const clienteElement = document.getElementById("cliente");
const idElement = document.getElementById("id");
const nombreEvaluadorElement = document.getElementById("nombreEvaluador");
const tituloProblemaElement = document.getElementById("tituloProblema");
const descripcionProblemaElement = document.getElementById("descripcionProblema");
const imagenElement = document.getElementById("imagen");
const comentarioElement = document.getElementById("comentario");
const agregarTurnoButton = document.getElementById("agregarTurno");
const nuevoTurnoForm = document.getElementById("nuevoTurnoForm");
const formularioTurno = document.getElementById("formularioTurno");

async function getUltimoID() {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '16nyuvP5Y4TmHjLnPAknJJIlQOBY5bXoa7imKKOn4BYQ',
      range: 'Turnos!A:E',
    });

    const range = response.result;
    if (!range || !range.values || range.values.length === 0) {
      return 1; // Si no hay datos, devuelve 1 como primer ID
    }

    // Obtiene el último ID en la última fila
    const ultimoID = parseInt(range.values[range.values.length - 1][0]);
    return ultimoID + 1; // Devuelve el siguiente ID
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function agregarNuevoTurno(turno) {
  const id = await getUltimoID(); // Obtiene el ID automáticamente
  turno.id = id.toString(); // Convierte el ID a cadena de texto y lo asigna al turno

  const update = [
    turno.id,
    turno.cliente,
    turno.evaluador,
    turno.tituloProblema,
    turno.descripcionProblema,
    turno.imagen
  ];

  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: '16nyuvP5Y4TmHjLnPAknJJIlQOBY5bXoa7imKKOn4BYQ',
      range: `Turnos!A:E`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      values: [update],
    });

    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function createTarjeta(turno, index) {
  const nuevaTarjeta = document.createElement("div");
  nuevaTarjeta.classList = "tarjeta";
  nuevaTarjeta.innerHTML = `
    <p>Título : ${turno.tituloProblema}</p>
    <p>ID: ${turno.id}</p>
    <p>Evaluador: ${turno.evaluador}</p>
    <p>Descripción : ${turno.descripcionProblema}</p>
    <img src="${turno.imagen}" alt="Imagen del problema">
  `;
  nuevaTarjeta.addEventListener("click", () => actualizarDetalle(index));
  turnosContainer.appendChild(nuevaTarjeta);
}

function actualizarTarjetas() {
  turnosContainer.innerHTML = "";
  turnos.forEach((turno, i) => {
    createTarjeta(turno, i);
  });
}

function actualizarDetalle(index) {
  if (indiceSeleccionado !== undefined) turnosContainer.children[indiceSeleccionado].classList.toggle("seleccionado", false);
  clienteElement.innerText = turnos[index].cliente;
  idElement.innerText = turnos[index].id;
  nombreEvaluadorElement.innerText = turnos[index].evaluador;
  tituloProblemaElement.innerText = turnos[index].tituloProblema;
  descripcionProblemaElement.innerText = turnos[index].descripcionProblema;
  imagenElement.src = turnos[index].imagen;
  detalleContainer.classList.toggle("escondido", false);
  indiceSeleccionado = index;
  turnosContainer.children[indiceSeleccionado].classList.toggle("seleccionado", true);
}

finalizar.addEventListener("click", () => marcarTerminado(indiceSeleccionado));

async function marcarTerminado(i) {
  const updateTurno = turnos[i];
  updateTurno.comentario = comentarioElement.value;
  const filaAEditar = 0; // Define filaAEditar según sea necesario
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

agregarTurnoButton.addEventListener("click", () => {
  nuevoTurnoForm.classList.toggle("escondido");
});

nuevoTurnoForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  const formData = new FormData(formularioTurno);
  const nuevoTurno = {};

  formData.forEach((value, key) => {
      nuevoTurno[key] = value;
  });

  await agregarNuevoTurno(nuevoTurno); // Llama a la función para agregar el nuevo turno
  nuevoTurnoForm.classList.toggle("escondido");
  formularioTurno.reset(); // Reinicia el formulario después de agregar el turno
});
``