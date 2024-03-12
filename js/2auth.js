const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("gapi").addEventListener("load", gapiLoaded);
  document.getElementById("gis").addEventListener("load", gisLoaded);
  document.getElementById('nuevoTurnoForm').style.display = 'none';
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
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('nuevoTurnoForm').style.display = 'block'; 
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
    await getTurnos();
    actualizarTarjetas();

    document.getElementById('nuevoTurnoForm').classList.remove('escondido');
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