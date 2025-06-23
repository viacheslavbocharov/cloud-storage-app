// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export type FileType = {
//   _id: string;
//   originalName: string;
//   size: number;
//   mimeType: string;
//   isDeleted: boolean;
//   folderId: string | null;
//   key: string;
//   sharedToken: string | null;
// };

// export type FolderType = {
//   _id: string;
//   name: string;
//   isDeleted: boolean;
//   path: string[];
//   key: string;
//   sharedToken: string | null;
// };

// type FileManagerState = {
//   currentPath: string[];
//   selectedIds: string[];
//   searchQuery: string;
//   viewingMode: 'normal' | 'trash';
//   draggingId: string | null;

//   foldersByParentId: Record<string, FolderType[]>;
//   filesByFolderId: Record<string, FileType[]>;
//   loadedFolders: string[]; // folderId[] + 'root'
// };

// const initialState: FileManagerState = {
//   currentPath: [],
//   selectedIds: [],
//   searchQuery: '',
//   viewingMode: 'normal',
//   draggingId: null,

//   foldersByParentId: {},
//   filesByFolderId: {},
//   loadedFolders: [],
// };

// const fileManagerSlice = createSlice({
//   name: 'fileManager',
//   initialState,
//   reducers: {
//     setFolderContents: (
//       state,
//       action: PayloadAction<{
//         parentFolderId: string | null;
//         folders: FolderType[];
//         files: FileType[];
//       }>,
//     ) => {
//       const key = action.payload.parentFolderId ?? 'root';
//       state.foldersByParentId[key] = action.payload.folders;
//       state.filesByFolderId[key] = action.payload.files;

//       if (!state.loadedFolders.includes(key)) {
//         state.loadedFolders.push(key);
//       }
//     },

//     setCurrentPath(state, action: PayloadAction<string[]>) {
//       state.currentPath = action.payload;
//       state.selectedIds = [];
//     },
//     setSelectedIds(state, action: PayloadAction<string[]>) {
//       state.selectedIds = action.payload;
//     },
//     setSearchQuery(state, action: PayloadAction<string>) {
//       state.searchQuery = action.payload;
//     },
//     setViewingMode(state, action: PayloadAction<'normal' | 'trash'>) {
//       state.viewingMode = action.payload;
//     },
//     setDraggingId(state, action: PayloadAction<string | null>) {
//       state.draggingId = action.payload;
//     },

//     deleteItem(state, action: PayloadAction<string>) {
//       const id = action.payload;

//       Object.values(state.filesByFolderId).forEach((fileList) => {
//         const file = fileList.find((f) => f._id === id);
//         if (file) file.isDeleted = true;
//       });

//       Object.values(state.foldersByParentId).forEach((folderList) => {
//         const folder = folderList.find((f) => f._id === id);
//         if (folder) folder.isDeleted = true;
//       });
//     },

//     restoreItem(state, action: PayloadAction<string>) {
//       const id = action.payload;

//       Object.values(state.filesByFolderId).forEach((fileList) => {
//         const file = fileList.find((f) => f._id === id);
//         if (file) file.isDeleted = false;
//       });

//       Object.values(state.foldersByParentId).forEach((folderList) => {
//         const folder = folderList.find((f) => f._id === id);
//         if (folder) folder.isDeleted = false;
//       });
//     },
//   },
// });

// export const {
//   setFolderContents,
//   setCurrentPath,
//   setSelectedIds,
//   setSearchQuery,
//   setViewingMode,
//   setDraggingId,
//   deleteItem,
//   restoreItem,
// } = fileManagerSlice.actions;

// export default fileManagerSlice.reducer;

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
};

export type FolderType = {
  _id: string;
  name: string;
  isDeleted: boolean;
  path: string[];
  key: string;
  sharedToken: string | null;
};

type RenameItem = {
  id: string;
  originalName: string;
  type: 'file' | 'folder';
};

type FileManagerState = {
  currentPath: string[];
  selectedIds: string[];
  searchQuery: string;
  viewingMode: 'normal' | 'trash';
  draggingId: string | null;
  renameItem: RenameItem | null;

  foldersByParentId: Record<string, FolderType[]>;
  filesByFolderId: Record<string, FileType[]>;
  loadedFolders: string[]; // folderId[] + 'root'
};

const initialState: FileManagerState = {
  currentPath: [],
  selectedIds: [],
  searchQuery: '',
  viewingMode: 'normal',
  draggingId: null,
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
      }>
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
    setDraggingId(state, action: PayloadAction<string | null>) {
      state.draggingId = action.payload;
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
    updateFileName(state, action: PayloadAction<{ id: string; newName: string }>) {
      const { id, newName } = action.payload;
      for (const files of Object.values(state.filesByFolderId)) {
        const file = files.find((f) => f._id === id);
        if (file) file.originalName = newName;
      }
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
} = fileManagerSlice.actions;

export const selectRenameItem = (state: RootState) => state.fileManager.renameItem;

export default fileManagerSlice.reducer;

