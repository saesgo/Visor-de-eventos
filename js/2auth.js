const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Credenciales
const CLIENT_ID = '1005569025756-kksskuv94c1l4evjqmtio94verh9ccro.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDDE3BWzDplGzs-sofxzIEzwWtB8jnT5es';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gapi').addEventListener('load', gapiLoaded);
    document.getElementById('nuevoTurnoForm').style.display = 'none';
});

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES,
    });

    gapiInited = true;
    maybeEnableButtons();
}

// Función para inicializar tokenClient después de cargar la API de Google
function initializeTokenClient() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '',
    });
    gisInited = true;
    maybeEnableButtons();
}

window.addEventListener('load', function() {
    // Llama a gisLoaded después de que se ha cargado la ventana
    gisLoaded();
});

function gisLoaded() {
    // Llama a la función para inicializar tokenClient después de cargar la API de Google
    initializeTokenClient();
}

function maybeEnableButtons() {
    // Solo activa los botones cuando tanto gapiInited como gisInited sean true
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('nuevoTurnoForm').style.display = 'block'; 

        // Después de que gapi.client esté definido, habilitamos el evento click en el botón de autorización
        document.getElementById('authorize_button').addEventListener('click', handleAuthClick);
    }
}

function handleAuthClick() {
    // Verificar si gapi.client está definido antes de continuar
    if (!gapiInited || typeof gapi.client === 'undefined') {
        console.error('gapi.client is not yet defined. Please wait for initialization.');
        return;
    }

    // Lógica para manejar la autenticación
    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

function handleSignoutClick() {
    // Lógica para manejar el cierre de sesión
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}
