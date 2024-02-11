// 🐙 Importing necessary Electron modules
const { app, BrowserWindow } = require('electron');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.setMenuBarVisibility(false);

    // 🐙 Load a remote URL
    mainWindow.loadURL('http://gilbert-netbook.local:3000/display/?room=Mill%20A');

    // Listen for load failures.
    mainWindow.webContents.on('did-fail-load', () => {
        console.log("Page failed to load, will attempt to refresh in 15 seconds.");
        // Set a timeout to refresh the page after 15 seconds.
        setTimeout(() => {
            mainWindow.reload();
        }, 15000); // 15 seconds
    });
}


// 🐙 This method will be called when Electron has finished initialization.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
