import dotenv from 'dotenv'
dotenv.config()
import { app, shell, BrowserWindow } from 'electron'
import { createServer } from 'http'
import path from 'path'
import next from 'next'


const startNextApp = async () => {
  try {
    const nextPort = parseInt(process.env.NEXTJS_SERVER_PORT || '3033', 10)
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
    title: 'Talkabout',
    width: 1600,
    height: 1024,
    center: true,
    backgroundColor: "#0A0A0A",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: !app.isPackaged
    }
  })

  const loadURL = async () => {
    if (!app.isPackaged) {
      mainWindow.loadURL('http://localhost:3000')
    } else {
      try {
        await startNextApp()
        const nextServerURL = `http://localhost:${process.env.NEXTJS_SERVER_PORT || 3033}`
        mainWindow.loadURL(nextServerURL)

      } catch (error) {
        console.log(`Error initializing server: ${error}`)
      }
    }
  }
  loadURL()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
    }
    event.preventDefault()
  })

  return mainWindow
}

app.whenReady().then(() => {
  createMainWindow()
  app.on('activate', () => {
    if (BrowserWindow.length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
