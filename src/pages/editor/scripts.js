// importando dependencidas

const {ipcRenderer} = require('electron');

//set file

ipcRenderer.on('set-file', function (event, data) {
    console.log(data);
});