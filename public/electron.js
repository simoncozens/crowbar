const electron = require("electron"),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow,
  ipc = electron.ipcMain;

const path = require("path"),
  isDev = require("electron-is-dev");
const chokidar = require("chokidar");
var fs = require("fs");

let mainWindow;
let watcher;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: __dirname + "/preload.js",
    },
  });
  const appUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;
  mainWindow.loadURL(appUrl);
  mainWindow.on("closed", () => (mainWindow = null));
};
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  // Follow OS convention on whether to quit app when
  // all windows are closed.
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  // If the app is still open, but no windows are open,
  // create one when the app comes into focus.
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on("toMain", (event, args) => {
  console.log("Received message", event, args);
  if (args.type == "new font") {
    mainWindow.setTitle("Crowbar - " + args.fileName);
    watcher = chokidar.watch(args.filePath);
    watcher.on("change", (path) => {
      console.log(`File ${path} has been changed`);
      // Read the file
      fs.readFile(path, (err, data) => {
        if (err) {
          return;
        }
        let ab = data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength
        );
        mainWindow.webContents.send("fromMain", {
          type: "reload font",
          filename: args.fileName,
          content: ab,
        });
      });
    });
  }
});
