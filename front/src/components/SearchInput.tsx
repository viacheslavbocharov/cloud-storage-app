// import { Input } from "@/components/ui/input"
// import { Search } from "lucide-react"

// export function SearchInput() {
//   return (
//     <div className="relative w-full max-w-sm">
//       <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
//       <Input
//         type="text"
//         placeholder="Search the docs..."
//         className="pl-10 rounded-lg"
//       />
//     </div>
//   )
// }

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useState, useEffect } from "react";
import { setFolderContents, setViewingMode } from "@/store/fileManagerSlice";
import api from "@/utils/axios";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const dispatch = useDispatch<AppDispatch>();
  const viewingMode = useSelector(
    (state: RootState) => state.fileManager.viewingMode
  );

  const [query, setQuery] = useState("");

  const placeholder =
    viewingMode === "trash"
      ? "To search in Bin enter min 3 symbols"
      : "To search in My Drive enter min 3 symbols";

  // При очистке возвращаем в исходное состояние
  const clearSearch = async () => {
    setQuery("");
    dispatch(setViewingMode("normal"));

    try {
      if (viewingMode === "trash") {
        // Перезагружаем корзину
        const res = await api.get("/bin");
        dispatch(
          setFolderContents({
            parentFolderId: null,
            folders: res.data.folders,
            files: res.data.files,
          })
        );
      } else {
        // Перезагружаем корень
        const res = await api.get("/folders/contents");
        dispatch(
          setFolderContents({
            parentFolderId: null,
            folders: res.data.folders,
            files: res.data.files,
          })
        );
      }
    } catch (err) {
      console.error("Error during clearing search", err);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      dispatch(setViewingMode("normal"));
      return;
    }

    try {
      dispatch(setViewingMode("search"));

      const res = await api.get("/search", {
        params: {
          query: value,
          isDeleted: viewingMode === "trash" ? "true" : "false",
        },
      });

      dispatch(
        setFolderContents({
          parentFolderId: null,
          folders: res.data.folders,
          files: res.data.files,
        })
      );
    } catch (err) {
      console.error("Search error", err);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 pr-10 rounded-lg"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

