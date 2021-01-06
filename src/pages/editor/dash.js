//scripts do dash board

const {remote} = require('electron');
const main = remote.require('./main');
let user = [];

let usuario = []

function renderUsuario(dado) {

}

const captUsuario = async () => {
    usuario = await main.getUsuario();
    console.log(usuario)
    renderUsuario(usuario)
}

