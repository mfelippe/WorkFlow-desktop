const {app, BrowserWindow, Menu} = require('electron');

// Janela Princioal
var mainWindow = null;

async function createWindow() {  //asyn pq tem funções assincronas
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600

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

// template Menu
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
    }] // faz a verificação se é mac or windows
;

// Menu
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);
//ON READY
app.whenReady().then(createWindow);

//activate
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().lenght === 0) {
    createWindow();
  }
})
