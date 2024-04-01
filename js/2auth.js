DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Credenciales
const CLIENT_ID = '1005569025756-kksskuv94c1l4evjqmtio94verh9ccro.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDDE3BWzDplGzs-sofxzIEzwWtB8jnT5es';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("gapi").addEventListener("load", gapiLoaded());
  document.getElementById("gis").addEventListener("load", gisLoaded());
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
});


function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  const credentialsPath = './credentials/arcane-footing-410615-6963d7a968fa.json';
  const credentials = await fetch(credentialsPath).then(response => response.json());

  await gapi.client.init({
    apiKey: credentials.apiKey,
    clientId: credentials.clientId,
    discoveryDocs: [DISCOVERY_DOC],
    scope: SCOPES,
  });

  gapiInited = true;
  maybeEnableButtons();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '',
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  // Solo activa los botones cuando tanto gapiInited como gisInited sean true
  if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
      document.getElementById('signout_button').style.visibility = 'hidden';
      document.getElementById('nuevoTurnoForm').style.visibility = 'hidden'; 
  }
}

function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      console.error(resp.error);
      return;
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Recargar';
    document.getElementById('nuevoTurnoForm').style.visibility = 'visible';
    await getTurnos();
    actualizarTarjetas();
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}