const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let server;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.ico')
  });

  // Always use built files
  const buildPath = path.join(__dirname, '../client/build/index.html');
  const startUrl = `file://${buildPath}`;

  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  return new Promise((resolve) => {
    try {
      const rootDir = path.join(__dirname, '..');
      const serverPath = path.join(rootDir, 'server.js');
      
      console.log('Starting server from:', serverPath);
      
      server = spawn('node', [serverPath], {
        cwd: rootDir,
        stdio: 'ignore',
        detached: true
      });

      server.unref();
      console.log('Backend server started');
    } catch (err) {
      console.log('Server already running or error:', err.message);
    }

    // Wait for server to be ready
    setTimeout(resolve, 2000);
  });
}

app.on('ready', async () => {
  console.log('Electron app ready');
  
  // Start backend server
  await startServer();
  
  // Create window
  setTimeout(createWindow, 500);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (server) {
    try {
      process.kill(-server.pid);
    } catch (e) {
      // Already stopped
    }
  }
});

