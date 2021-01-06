const {app, BrowserWindow, Menu, remote, Notification} = require('electron');
// adcionando o arquivo para conexção com o banco de dados
const {conex} = require('./database');

var tentativa = 0;
var identificador = '';


//função de comunicação remota
async function consultaLogin(usuario) {
  try {

    const conn = await conex();
    await conn.query('SELECT * FROM desk WHERE nome = ?', usuario.nome, function (error, results, fields) {
      if (error) console.log("Ops, encontramos um problema");

      //carregamento dos dados encontrados no banco
      results.forEach(function (row) {
        if (usuario.senha === row.senha) {
          usuario.id = row.id;
          identificador = row.id;
          //notificação de login
          new Notification({
            title: 'Olá ' + usuario.nome,
            body: 'bem vindo ao WorkFlow Arteon Z'
          }).show()
          //função de abrir nova tela
          openPainel();

          mainWindow.close();

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
  const conn = await conex();

  const results = await conn.query('SELECT * FROM desk WHERE id = ?', identificador)
  //console.log(results)
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
  await mainWindow.loadFile('./src/pages/editor/login.html');
}

// ARQUIVO
var file = {};

// funções do menu
function createNewFile() {
  // função para criar um novo arquivo no programa
  file = {
    name: 'novo-arquivo.txt',
    content: '',
    saved: false,
    path: app.getPath('documents') + '/novo-arquivo.txt'
  };

  mainWindow.webContents.send('set-file', file);
}

/* template Menu
const templateMenu = [{
      label: 'Arquivo',
      submenu: [{
        label: 'Novo',
        click() {
          //configurando uma função quando for criado no clique no menu
          createNewFile();
        }
      }, {label: 'Abrir'}, {label: 'Salvar'}]
    }, {
      label: 'Fechar',
      role: process.platform === 'darwin' ? 'close' : 'quit'
    }] // faz a verificação se é mac or windows;

// Menu
//const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);
*/
//ON READY
app.whenReady().then(createWindow);

//activate
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



