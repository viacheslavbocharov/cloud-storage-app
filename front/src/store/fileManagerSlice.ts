import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FileType = {
  _id: string;
  originalName: string;
  size: number;
  mimeType: string;
  isDeleted: boolean;
  folderId: string | null;
  key: string;
};

export type FolderType = {
  _id: string;
  name: string;
  isDeleted: boolean;
  path: string[];
  key: string;
};

type FileManagerState = {
  currentPath: string[]; // текущий путь в виде массива id
  selectedIds: string[]; // выделенные id
  searchQuery: string;   // строка поиска
  viewingMode: 'normal' | 'trash';
  draggingId: string | null;
  folders: FolderType[];
  files: FileType[];
};

const initialState: FileManagerState = {
  currentPath: [],
  selectedIds: [],
  searchQuery: '',
  viewingMode: 'normal',
  draggingId: null,
  folders: [],
  files: [],
};

const fileManagerSlice = createSlice({
  name: 'fileManager',
  initialState,
  reducers: {
    setCurrentPath(state, action: PayloadAction<string[]>) {
      state.currentPath = action.payload;
      state.selectedIds = []; // сброс выделения
    },
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setViewingMode(state, action: PayloadAction<'normal' | 'trash'>) {
      state.viewingMode = action.payload;
    },
    setDraggingId(state, action: PayloadAction<string | null>) {
      state.draggingId = action.payload;
    },
    setFoldersAndFiles(
      state,
      action: PayloadAction<{ folders: FolderType[]; files: FileType[] }>
    ) {
      state.folders = action.payload.folders;
      state.files = action.payload.files;
    },
    deleteItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const file = state.files.find(f => f._id === id);
      const folder = state.folders.find(f => f._id === id);
      if (file) file.isDeleted = true;
      if (folder) folder.isDeleted = true;
    },
    restoreItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const file = state.files.find(f => f._id === id);
      const folder = state.folders.find(f => f._id === id);
      if (file) file.isDeleted = false;
      if (folder) folder.isDeleted = false;
    },
  },
});

export const {
  setCurrentPath,
  setSelectedIds,
  setSearchQuery,
  setViewingMode,
  setDraggingId,
  setFoldersAndFiles,
  deleteItem,
  restoreItem,
} = fileManagerSlice.actions;

export default fileManagerSlice.reducer;
