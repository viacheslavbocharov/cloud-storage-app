import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchInput() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
      <Input
        type="text"
        placeholder="Search the docs..."
        className="pl-10 rounded-lg"
      />
    </div>
  )
}
