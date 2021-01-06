const {app, BrowserWindow, Menu, remote} = require('electron');
// adcionando o arquivo para conexção com o banco de dados
const {conex} = require('./database');
//variaveis do sistema
var pagina = 'src/pages/editor/login.html';
var altura = 600;
var largura = 500;


//função de comunicação remota
async function consultaLogin(usuario) {
  try {
    let tentativa = 0;
    const conn = await conex();
    await conn.query('SELECT * FROM desk WHERE nome = ?', usuario.nome, function (error, results, fields) {
      if (error) tentativa = 1 + tentativa;

      results.forEach(function (row) {
        if (usuario.senha != row.senha) {
          //script para avisar que a senha tá errada

        } else {
          usuario.id = row.id;
          console.log(usuario)
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


async function createWindow(altura = 800, largura = 600, pagina) {  //asyn pq tem funções assincronas
  mainWindow = new BrowserWindow({
    width: largura,
    height: altura,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }

  });
  await mainWindow.loadFile('src/pages/editor/login.html');
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



