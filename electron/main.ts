import dotenv from "dotenv"
import { app, shell, BrowserWindow, ipcMain } from "electron"
import { createServer } from "http"
import path from "path"
import next from "next"


dotenv.config({
  path: app.isPackaged
    ? path.join(process.resourcesPath, ".env")
    : path.resolve(process.cwd(), ".env")
})

const startNextApp = async () => {
  try {
    const nextPort = parseInt(process.env.PORT || "3033", 10)
    const webDir = path.join(app.getAppPath(), "app")
    const nextApp = next({
      dev: false,
      dir: webDir,
      hostname: "localhost",
      port: nextPort,
    })
    const requestHandler = nextApp.getRequestHandler()

    await nextApp.prepare()

    const server = createServer(requestHandler)
    server.listen(nextPort)

  } catch (error) {
    console.log(`Error starting NextJS Server: ${error}`)
    throw error
  }
}

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Talkabout",
    width: 1600,
    height: 1024,
    center: true,
    backgroundColor: "#0A0A0A",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  const loadURL = async () => {
    if (!app.isPackaged) {
      mainWindow.loadURL("http://localhost:3000")
    } else {
      try {
        await startNextApp()
      
        const nextServerURL = `http://localhost:${process.env.PORT || 3033}`
        mainWindow.loadURL(nextServerURL)
      
      } catch (error) {
        console.log(`Error initializing server: ${error}`)
      }
    }
  }
  loadURL()

  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })
  
  const isInternalUrl = (url: string) => url.startsWith("http://localhost")
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!isInternalUrl(url)) {
      shell.openExternal(url)
      return { action: "deny" }
    }
    return { action: "allow" }
  })
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isInternalUrl(url)) {
      shell.openExternal(url)
      event.preventDefault()
    }
  })

  return mainWindow
}

app.whenReady().then(() => {
  createMainWindow()
  app.on("activate", createMainWindow)
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

ipcMain.on("open-login-window", (event, redirectUrl) => {
  const loginWindow = new BrowserWindow({
    title: "Talkabout",
    width: 764,
    height: 1024,
    center: true,
    backgroundColor: "#0A0A0A",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    }
  })
  loginWindow.loadURL(redirectUrl)

  loginWindow.on("ready-to-show", () => {
    loginWindow.show()
  })
})
