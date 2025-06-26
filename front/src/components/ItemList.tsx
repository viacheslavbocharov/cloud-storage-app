// import { ItemRow } from './ItemRow';
import { FileRow } from './FileRow';
import { FolderRow } from './FolderRow';
import type { FileType, FolderType } from '@/store/fileManagerSlice';

interface ItemListProps {
  folders: FolderType[];
  files: FileType[];
}

export function ItemList({ folders, files }: ItemListProps) {
  return (
    <div className="flex flex-col gap-1">
      {folders.map((folder) => (
        <FolderRow key={folder._id} item={folder} />
      ))}
      {files.map((file) => (
        <FileRow key={file._id} item={file} />
      ))}
    </div>
  );
}
