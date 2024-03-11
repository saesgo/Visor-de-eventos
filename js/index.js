const turnosContainer = document.getElementById("turnosContainer");
const detalleContainer = document.getElementById("detalleContainer");
let indiceSeleccionado;
const clienteElement = document.getElementById("cliente");
const idElement = document.getElementById("id");
const nombreEvaluadorElement = document.getElementById("nombreEvaluador");
const tituloProblemaElement = document.getElementById("tituloProblema");
const descripcionProblemaElement = document.getElementById("descripcionProblema");
const imagenElement = document.getElementById("imagen");
const comentarioElement = document.getElementById("comentarioElement");
const finalizar = document.getElementById("finalizar");
const agregarTurno = document.getElementById("agregarTurno");
const nuevoTurnoForm = document.getElementById("nuevoTurnoForm");
const formularioTurno = document.getElementById("formularioTurno");

// Agrega la función init
async function init() {
  // Inicializa la aplicación después de que el usuario haya iniciado sesión
  const detailContainer = document.getElementById('detalleContainer');
  const nuevoTurnoForm = document.getElementById('nuevoTurnoForm');
 // Ocultar botones de iniciar/cerrar sesión y mostrar formulario
  document.getElementById('authorize_button').style.display = 'none';
  document.getElementById('signout_button').style.display = 'none';
  nuevoTurnoForm.style.display = 'block';
  detailContainer.style.display = 'block';
}
  
async function getUltimoID(spreadsheetId, range) {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const { values } = response.result;
    const ultimoID = +values?.[values.length - 1]?.[0] ?? 0;
    return ultimoID + 1;
  } catch (err) {
    console.error(`Error in getUltimoID: ${err.message}`);
    throw new Error(`Failed to get the last ID: ${err.message}`);
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
  indiceSeleccionado = index; // Define el índice seleccionado aquí
  if (indiceSeleccionado !== undefined) turnosContainer.children[indiceSeleccionado].classList.toggle("seleccionado", false);
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

async function agregarNuevoTurno(turno) {
  const id = await getUltimoID(); // Obtiene el ID automáticamente
  turno.id = id.toString(); // Convierte el ID a cadena de texto y lo asigna al turno
  const update = [
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

agregarTurno.addEventListener("click", () => {
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

document.getElementById("insertarImagen").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
      const imageURL = await subirImagenAImgur(file);
      if (imageURL) {
          document.getElementById("imagenURLNuevo").value = imageURL;
          alert("La imagen se ha subido correctamente a Imgur.");
      } else {
          alert("Hubo un problema al subir la imagen a Imgur. Por favor, inténtalo de nuevo.");
      }
  }
});

async function subirImagenAImgur(file) {
  try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("https://api.imgur.com/3/image", {
          method: "POST",
          headers: {
              Authorization: "Client-ID {ae16a4008387500}", // Reemplaza con tu Client-ID de Imgur
          },
          body: formData
      });
      const data = await response.json();
      return data.success ? data.data.link : null;
  } catch (error) {
      console.error("Error al subir la imagen a Imgur:", error);
      return null;
  }
}