// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("gapi").addEventListener("load", gapiLoaded);
  document.getElementById("gis").addEventListener("load", gisLoaded);

  document.getElementById('authorize_button').style.visibility = 'hidden';
  document.getElementById('signout_button').style.visibility = 'hidden';
  document.getElementById('agregarTurno').style.display = 'none'; // Ocultar el botón de "Agregar Turno"
});

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  // Load credentials from JSON file
  const credentialsPath = './credentials/arcane-footing-410615-6963d7a968fa.json'; // Adjust the path accordingly
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

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
    document.getElementById('signout_button').style.visibility = 'visible'; // Mostrar el botón de cerrar sesión
    document.getElementById('nuevoTurnoForm').style.display = 'block'; // Mostrar el formulario después de iniciar sesión
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      console.error(resp.error);
      return;
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await getTurnos();
    actualizarTarjetas();
    document.getElementById('agregarTurno').style.display = 'block'; // Mostrar el botón de "Agregar Turno" después de iniciar sesión
  };
}

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
    document.getElementById('agregarTurno').style.display = 'none'; // Ocultar el botón de "Agregar Turno"
  }
}