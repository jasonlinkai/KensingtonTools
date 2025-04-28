import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的 IPC 通信介面給渲染進程
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args);
    },
    on: (channel: string, listener: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (event, ...args) => listener(...args));
    },
    removeListener: (channel: string, listener: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, (event, ...args) => listener(...args));
    }
  },
  getSystemLanguage: () => ipcRenderer.invoke('get-system-language'),
}); 