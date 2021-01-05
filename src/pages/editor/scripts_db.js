const form_login = document.querySelector('form');

const {remote} = require('electron');
const main = remote.require('./main');

const user = document.getElementById('email');
const password = document.getElementById('senha');

form_login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProduct = {
        nome: user.value,
        senha: password.value
    }
    const resulta = await main.consultaLogin(newProduct);
    console.log(resulta);

});

