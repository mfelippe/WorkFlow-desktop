const {app, BrowserWindow, Menu, remote, Notification} = require('electron');
// adcionando o arquivo para conexção com o banco de dados
const {conex} = require('./database');

var tentativa = 0;
var identificador = '';



//função de comunicação remota
async function consultaLogin(usuario) {
  try {

    const conn = await conex();
    await conn.query('SELECT * FROM desk WHERE email = ?', usuario.email, function (error, results, fields) {
      if (error) console.log("Ops, encontramos um problema");
      //carregamento dos dados encontrados no banco
      results.forEach(function (row) {
        console.log('id ', row.id)
        if (usuario.senha === row.senha) {
          //salvando o id para o carregamento do usuario
          identificador = row.id;
          //notificação de login
          new Notification({
            title: 'Olá ' + usuario.email,
            body: 'bem vindo ao WorkFlow Arteon Z'
          }).show()
          //função de abrir nova tela
          openPainel();
          mainWindow.close(); //fechando tela de login
          return (usuario);
        } else {
          console.log("ERRO email ou login digitado errado", tentativa)
          tentativa = tentativa + 1;
          if (tentativa < 3) {
            new Notification({
              title: 'Ops, encontramos alguns errros',
              body: 'Porfavor, verifique o email ou a senha inserida'
            }).show()
          } else {
            mainWindow.close();
          }
        }

      });


    });
  } catch (error) {

    //notificação de erro ao se conectar ao banco de dados

    new Notification({
      title: 'ERRO AO SE CONECTAR',
      body: 'Não Foi Possível se conectar ao servidor, verifique sua conexção'
    }).show()
    return (error)
  }

}

//script de captura de usuario logado
async function getUsuario() {
  const usuario = null
  const conn = await conex();

  const results = await conn.query('SELECT * FROM desk WHERE id = ?', identificador)
  //console.log(results);
  return results;
}

//abertura de janela
async function openPainel() {

  const painel = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }

  });
  Menu.setApplicationMenu(menuMaster);
  await painel.loadFile('./src/pages/editor/painel.html');


}

// Janela Princioal

var mainWindow = null;

async function createWindow() {  //asyn pq tem funções assincronas
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }

  });
  Menu.setApplicationMenu(menuLogin);
  await mainWindow.loadFile('./src/pages/editor/login.html');
}

// ARQUIVO
var file = {};

// funções do menu
function abrirPainel() {

}

// template Menu
const templateMenuLogin = [{
  /*label: 'DashBoard',
  submenu: [{
    label: 'Novo',
    click() {
      //configurando uma função quando for criado no clique no menu
      createNewFile();
    }
  }]
}, {
  */label: 'Fechar',
  role: process.platform === 'darwin' ? 'close' : 'quit'
}] // faz a verificação se é mac or windows;

//Menu aplicação
const templateMenuMaster = [{
  label: 'DashBoard',
  submenu: [{
    label: 'Novo',
    click() {
      //configurando uma função quando for criado no clique no menu
      createNewFile();
    }
  }]
}, {label: 'Desembolso'}, {
  label: 'Fechar',
  role: process.platform === 'darwin' ? 'close' : 'quit'
}]

// Menus
const menuLogin = Menu.buildFromTemplate(templateMenuLogin);
const menuMaster = Menu.buildFromTemplate(templateMenuMaster);

//ON READY
app.whenReady().then(createWindow);

//activate faz abertura de janela no MascOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().lenght === 0) {
    createWindow();
  }
})

//exportação de módulos

module.exports = {
  consultaLogin,
  getUsuario
}



