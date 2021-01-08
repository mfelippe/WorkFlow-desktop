const form_login = document.querySelector('form');
const {remote} = require('electron');
const main = remote.require('./main');
const user = document.getElementById('email');
const password = document.getElementById('senha');


form_login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUser = {
        email: user.value,
        senha: password.value
    }
    await main.consultaLogin(newUser);

});
