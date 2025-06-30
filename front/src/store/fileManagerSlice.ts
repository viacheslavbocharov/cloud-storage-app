import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export type FileType = {
  _id: string;
  originalName: string;
  size: number;
  mimeType: string;
  isDeleted: boolean;
  folderId: string | null;
  key: string;
  sharedToken: string | null;
  access: 'private' | 'link';
};

export type FolderType = {
  _id: string;
  name: string;
  isDeleted: boolean;
  path: string[];
  key: string;
  sharedToken: string | null;
  access: 'private' | 'link';
  parentFolderId: string | null;
};

type RenameItem = {
  id: string;
  originalName: string;
  type: 'file' | 'folder';
};

type FileManagerState = {
  currentPath: string[];
  selectedIds: string[];
  lastSelectedId: string | null;
  searchQuery: string;
  viewingMode: 'normal' | 'trash';
  draggingId: string | null;
  isDragging: boolean;
  dragItems: { id: string; type: 'file' | 'folder' }[];
  renameItem: RenameItem | null;

  foldersByParentId: Record<string, FolderType[]>;
  filesByFolderId: Record<string, FileType[]>;
  loadedFolders: string[]; // folderId[] + 'root'
};

const initialState: FileManagerState = {
  currentPath: [],
  selectedIds: [],
  lastSelectedId: null,
  searchQuery: '',
  viewingMode: 'normal',
  draggingId: null,
  isDragging: false,
  dragItems: [],
  renameItem: null,

  foldersByParentId: {},
  filesByFolderId: {},
  loadedFolders: [],
};

const fileManagerSlice = createSlice({
  name: 'fileManager',
  initialState,
  reducers: {
    setFolderContents: (
      state,
      action: PayloadAction<{
        parentFolderId: string | null;
        folders: FolderType[];
        files: FileType[];
      }>,
    ) => {
      const key = action.payload.parentFolderId ?? 'root';
      state.foldersByParentId[key] = action.payload.folders;
      state.filesByFolderId[key] = action.payload.files;

      if (!state.loadedFolders.includes(key)) {
        state.loadedFolders.push(key);
      }
    },

    setCurrentPath(state, action: PayloadAction<string[]>) {
      state.currentPath = action.payload;
      state.selectedIds = [];
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

    deleteItem(state, action: PayloadAction<string>) {
      const id = action.payload;

      Object.values(state.filesByFolderId).forEach((fileList) => {
        const file = fileList.find((f) => f._id === id);
        if (file) file.isDeleted = true;
      });

      Object.values(state.foldersByParentId).forEach((folderList) => {
        const folder = folderList.find((f) => f._id === id);
        if (folder) folder.isDeleted = true;
      });
    },

    restoreItem(state, action: PayloadAction<string>) {
      const id = action.payload;

      Object.values(state.filesByFolderId).forEach((fileList) => {
        const file = fileList.find((f) => f._id === id);
        if (file) file.isDeleted = false;
      });

      Object.values(state.foldersByParentId).forEach((folderList) => {
        const folder = folderList.find((f) => f._id === id);
        if (folder) folder.isDeleted = false;
      });
    },

    openRenameModal(state, action: PayloadAction<RenameItem>) {
      state.renameItem = action.payload;
    },
    closeRenameModal(state) {
      state.renameItem = null;
    },
    updateFileName(
      state,
      action: PayloadAction<{ id: string; newName: string }>,
    ) {
      const { id, newName } = action.payload;
      for (const files of Object.values(state.filesByFolderId)) {
        const file = files.find((f) => f._id === id);
        if (file) file.originalName = newName;
      }
    },
    updateFolderName(
      state,
      action: PayloadAction<{ id: string; newName: string }>,
    ) {
      const { id, newName } = action.payload;
      for (const folderList of Object.values(state.foldersByParentId)) {
        const folder = folderList.find((f) => f._id === id);
        if (folder) folder.name = newName;
      }
    },

    updateItemShareLink(
      state,
      action: PayloadAction<{ id: string; sharedToken: string | null }>,
    ) {
      const { id, sharedToken } = action.payload;

      for (const files of Object.values(state.filesByFolderId)) {
        const file = files.find((f) => f._id === id);
        if (file) {
          file.sharedToken = sharedToken;
          file.access = sharedToken ? 'link' : 'private';
        }
      }

      for (const folders of Object.values(state.foldersByParentId)) {
        const folder = folders.find((f) => f._id === id);
        if (folder) {
          folder.sharedToken = sharedToken;
          folder.access = sharedToken ? 'link' : 'private';
        }
      }
    },
    setDraggingId(state, action: PayloadAction<string | null>) {
      state.draggingId = action.payload;
    },
    setLastSelectedId(state, action: PayloadAction<string | null>) {
      state.lastSelectedId = action.payload;
    },
    setIsDragging(state, action: PayloadAction<boolean>) {
      state.isDragging = action.payload;
    },
    setDragItems(
      state,
      action: PayloadAction<{ id: string; type: 'file' | 'folder' }[]>,
    ) {
      state.dragItems = action.payload;
    },
    selectRange(state, action: PayloadAction<string>) {
      const currentFolderId =
        state.currentPath[state.currentPath.length - 1] || 'root';

      const allItems = [
        ...(state.foldersByParentId[currentFolderId] || []).map((f) => ({
          id: f._id,
        })),
        ...(state.filesByFolderId[currentFolderId] || []).map((f) => ({
          id: f._id,
        })),
      ];

      const startIndex = allItems.findIndex(
        (item) => item.id === state.lastSelectedId,
      );
      const endIndex = allItems.findIndex((item) => item.id === action.payload);

      if (startIndex === -1 || endIndex === -1) return;

      const [from, to] =
        startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const range = allItems.slice(from, to + 1).map((item) => item.id);

      state.selectedIds = range;
    },
  },
});

export const {
  setFolderContents,
  setCurrentPath,
  setSelectedIds,
  setSearchQuery,
  setViewingMode,
  setDraggingId,
  deleteItem,
  restoreItem,
  openRenameModal,
  closeRenameModal,
  updateFileName,
  updateFolderName,
  updateItemShareLink,
  setLastSelectedId,
  setIsDragging,
  setDragItems,
  selectRange,
} = fileManagerSlice.actions;

export const selectRenameItem = (state: RootState) =>
  state.fileManager.renameItem;

export default fileManagerSlice.reducer;
