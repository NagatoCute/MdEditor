const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('main/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('open-file', async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Markdown Files', extensions: ['md'] }]
    });

    if (!canceled && filePaths.length > 0) {
        const filePath = filePaths[0];
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Failed to read file:', err);
                return;
            }
            event.sender.send('file-content', data);
        });
    }
});

ipcMain.on('save-file', async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [{ name: 'Markdown Files', extensions: ['md'] }]
    });

    if (!canceled && filePath) {
        fs.writeFile(filePath, content, 'utf-8', (err) => {
            if (err) {
                console.error('Failed to save file:', err);
                return;
            }
            console.log('File saved successfully:', filePath);
        });
    }
});
