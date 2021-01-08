const {remote} = require('electron');
const main = remote.require('./main');
const inf = document.getElementById('inf_user');

let usuario = []

function renderUsuario(dado) {

    inf.innerHTML += `<p> Olá ${dado.email}</p>`;
}

async function captUser() {
    usuario = await main.getUsuario();
    console.log(usuario);
    renderUsuario(usuario[0]);
}

async function init() {
    await captUser();
}

init();