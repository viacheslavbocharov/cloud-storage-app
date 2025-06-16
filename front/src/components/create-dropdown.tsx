import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { FolderPlus, Upload, FolderUp, Plus } from "lucide-react"

export function CreateDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-1/2 rounded-lg mb-[10px] pl-[3px] py-6 text-base font-medium shadow-sm cursor-pointer" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom" align="start" sideOffset={4}>
        <DropdownMenuItem>
          <FolderPlus className="mr-2 h-4 w-4" />
          <span>New folder</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Upload className="mr-2 h-4 w-4" />
          <span>File upload</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FolderUp className="mr-2 h-4 w-4" />
          <span>Folder upload</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
