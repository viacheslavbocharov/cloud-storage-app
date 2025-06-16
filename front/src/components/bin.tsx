import { Trash2 } from "lucide-react"

export function BinButton() {
  return (
    <button className="flex items-center gap-2 px-0 py-1 text-base hover:opacity-80 cursor-pointer">
      <Trash2 className="h-4 w-4" />
      <span>Bin</span>
    </button>
  )
}

