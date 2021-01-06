const form_login = document.querySelector('form');

const {remote} = require('electron');
const main = remote.require('./main');

const user = document.getElementById('email');
const password = document.getElementById('senha');

/*const captUsuario = async()=>{
    await usuario = main.getUsuario();
    console.log(usuario)
}*/

form_login.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newUser = {
        nome: user.value,
        senha: password.value
    }

    await main.consultaLogin(newUser);

});

