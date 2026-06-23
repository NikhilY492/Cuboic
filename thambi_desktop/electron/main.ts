import { app, BrowserWindow, ipcMain, safeStorage } from 'electron'
import { join } from 'node:path'
import fs from 'node:fs'
import { PosPrinter } from 'electron-pos-printer'


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.APP_ROOT = join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  console.log('[DEBUG] createWindow called');
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: join(process.env.VITE_PUBLIC as string, 'logo-thambi.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  console.log('[DEBUG] window-all-closed event triggered');
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  console.log('[DEBUG] activate event triggered');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Silence harmless Chromium disk cache corruption warnings by disabling it
app.commandLine.appendSwitch('disable-http-cache');

app.whenReady().then(() => {
  console.log('[DEBUG] App is ready, initializing...');
  createWindow()

  // --- Auth Storage Handlers ---
  const authPath = join(app.getPath('userData'), 'auth.dat')

  ipcMain.handle('auth:store-token', (_, token: string, outletId: string) => {
    console.log('[DEBUG] IPC handle: auth:store-token called for outlet:', outletId);
    try {
      if (safeStorage.isEncryptionAvailable()) {
        const encrypted = safeStorage.encryptString(JSON.stringify({ token, outletId }))
        fs.writeFileSync(authPath, encrypted)
        return true
      }
      return false
    } catch (e) {
      console.error('Failed to store token', e)
      return false
    }
  })

  ipcMain.handle('auth:get-token', () => {
    console.log('[DEBUG] IPC handle: auth:get-token called');
    try {
      if (fs.existsSync(authPath) && safeStorage.isEncryptionAvailable()) {
        const encrypted = fs.readFileSync(authPath)
        const decrypted = safeStorage.decryptString(encrypted)
        return JSON.parse(decrypted) // { token, outletId }
      }
      return null
    } catch (e) {
      console.error('Failed to read token', e)
      return null
    }
  })

  ipcMain.handle('auth:clear-token', () => {
    console.log('[DEBUG] IPC handle: auth:clear-token called');
    if (fs.existsSync(authPath)) fs.unlinkSync(authPath)
    return true
  })

  // --- Printing Handlers ---
  ipcMain.handle('print:get-printers', async (event) => {
    console.log('[DEBUG] IPC handle: print:get-printers called');
    try {
      return await event.sender.getPrintersAsync()
    } catch (e) {
      console.error("Failed to get printers", e)
      return []
    }
  })

  ipcMain.handle('print:kot', async (_, printerName: string, data: any[]) => {
    console.log('[DEBUG] IPC handle: print:kot called for printer:', printerName, 'with data length:', data?.length);
    try {
      const isPDF = printerName.toLowerCase().includes('pdf');
      await PosPrinter.print(data, {
        printerName,
        preview: false,
        width: '80mm',
        margin: '0 0 0 0',
        copies: 1,
        timeOutPerLine: 5000,
        silent: !isPDF,
        boolean: true, // fixing rogue type error from package
        pathTemplate: join(process.env.VITE_PUBLIC as string, 'print.html')
      } as any)
      return { success: true }
    } catch (error: any) {
      console.error("Print Error:", error)
      return { success: false, error: error.toString() }
    }
  })
})
