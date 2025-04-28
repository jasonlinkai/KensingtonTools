import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的 IPC 通信介面給渲染進程
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args);
    }
  }
}); 