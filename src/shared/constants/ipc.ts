// IPC 通道名稱
export const IPC_CHANNELS = {
  SELECT_FILE: 'select-file',
  SELECT_DIRECTORY: 'select-directory',
  READ_EXCEL_FILE: 'read-excel-file',
  LINGO_LOCALIZE_OBJECT: 'lingo-localize-object',
  LINGO_TRANSLATE_TEXT: 'lingo-translate-text',
  LINGO_SET_API_KEY: 'lingo-set-api-key',
  GET_SYSTEM_LANGUAGE: 'get-system-language',
} as const;

// 從 IPC_CHANNELS 物件中提取值的型別
export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];

// IPC 通道列表（用於驗證）
export const VALID_IPC_CHANNELS: IpcChannel[] = Object.values(IPC_CHANNELS); 