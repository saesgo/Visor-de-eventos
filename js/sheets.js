let turnos = [];

async function getTurnos() {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '16nyuvP5Y4TmHjLnPAknJJIlQOBY5bXoa7imKKOn4BYQ',
      range: 'Turnos!A2:G', // Rango corregido para incluir las cinco columnas
    });

    const range = response.result;
    if (!range || !range.values || range.values.length === 0) {
      console.warn("No se encontraron valores");
      return;
    }

    turnos = [];
    range.values.forEach((fila) => {
      if (isNaN(parseInt(fila[0])) || fila[6] !== undefined) return;
      const nuevoTurno = {
        id: fila[0],
        evaluador: fila[1], 
        tituloProblema: fila[2], 
        descripcionProblema: fila[3], 
        imagen: fila[4],
        fecha: fila[5],
        comentario: fila[6]
      };
      turnos.push(nuevoTurno);
    });
    console.log(turnos);
    } catch (err) {
    console.error(err);
  }
}


async function editTurno(id, contenido) {
  const update = [
    contenido.id,
    contenido.evaluador,
    contenido.tituloProblema,
    contenido.descripcionProblema,
    contenido.imagen,
    new Date().toISOString(),
    contenido.comentario
  ];

  

  try {
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: '16nyuvP5Y4TmHjLnPAknJJIlQOBY5bXoa7imKKOn4BYQ',
      range: `Turnos!A${filaAEditar}:G${filaAEditar}`, // Rango corregido para incluir las cinco columnas
      values: [update],
      valueInputOption: "USER_ENTERED"
    });

    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function addTurno(turno) {
  try {
      const response = await gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: '16nyuvP5Y4TmHjLnPAknJJIlQOBY5bXoa7imKKOn4BYQ',
          range: 'Turnos!A:E',
          valueInputOption: 'USER_ENTERED',
          resource: {
              values: [[
                  turno.cliente,
                  turno.evaluador,
                  turno.tituloProblema,
                  turno.descripcionProblema,
                  turno.imagen
              ]]
          }
      });

      console.log('Turno agregado:', response);
  } catch (error) {
      console.error('Error al agregar turno:', error);
  }
}

async function getLastId() {
  try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: '16nyuvP5Y4TmHjLnPAknJJIlQOBY5bXoa7imKKOn4BYQ',
          range: 'Turnos!A:E', // Rango que abarca todas las columnas necesarias
      });

      const range = response.result;
      if (!range || !range.values || range.values.length === 0) {
          console.warn("No se encontraron valores");
          return 0; // Si no hay valores, devolvemos 0 como el último ID
      }

      // Obtenemos el último ID de la última fila
      const lastRow = range.values[range.values.length - 1];
      const lastId = parseInt(lastRow[0]);
      return lastId;
  } catch (err) {
      console.error(err);
      return 0; // En caso de error, devolvemos 0 como el último ID
  }
}