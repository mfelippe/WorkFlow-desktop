const {app, BrowserWindow, Menu, remote, Notification} = require('electron');
// adcionando o arquivo para conexção com o banco de dados
const {conex} = require('./database');


//função de comunicação remota
async function consultaLogin(usuario) {
  try {
    let tentativa = 0;
    const conn = await conex();
    await conn.query('SELECT * FROM desk WHERE nome = ?', usuario.nome, function (error, results, fields) {
      if (error) tentativa = 1 + tentativa;

      results.forEach(function (row) {
        if (usuario.senha === row.senha) {
          usuario.id = row.id;
          console.log(usuario)
          const painel = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
              nodeIntegration: true,
              enableRemoteModule: true,
            }

          });
          painel.loadFile('./src/pages/editor/painel.html');
          mainWindow.close();
          return (usuario);

        }

      });


    });
  } catch (error) {
    console.log(error)
  }

}

// Janela Princioal

var mainWindow = null;

async function createWindow(pagina) {  //asyn pq tem funções assincronas
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

module.exports = {consultaLogin}



