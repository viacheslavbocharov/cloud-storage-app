// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuLabel,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// export function AccountMenu() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Avatar className="cursor-pointer">
//           <AvatarFallback>VB</AvatarFallback>
//         </Avatar>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         align="end"
//         className="w-64 text-white bg-zinc-800 p-3 rounded-md shadow-lg"
//       >
//         <div className="text-sm font-medium text-white">
//           Viacheslav Bocharov
//         </div>
//         <div className="text-sm text-muted-foreground">
//           viacheslavbocharov@gmail.com
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { LogOut, Settings, SunMoon } from "lucide-react"
// // import { useTheme } from "next-themes"

// export function AccountToolbar() {
//   const { setTheme, theme } = useTheme()

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light")
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-full shadow-sm">
//         {/* Аватар с тултипом */}
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Avatar className="cursor-pointer">
//               <AvatarFallback>VB</AvatarFallback>
//             </Avatar>
//           </TooltipTrigger>
//           <TooltipContent className="bg-zinc-800 text-white text-sm p-2 rounded-md">
//             <div className="font-bold">Viacheslav Bocharov</div>
//             <div className="text-muted-foreground">viacheslavbocharov@gmail.com</div>
//           </TooltipContent>
//         </Tooltip>

//         {/* Переключатель темы */}
//         <button onClick={toggleTheme} className="text-muted-foreground hover:text-primary transition">
//           <SunMoon className="w-5 h-5" />
//         </button>

//         {/* Настройки */}
//         <button className="text-muted-foreground hover:text-primary transition">
//           <Settings className="w-5 h-5" />
//         </button>

//         {/* Выход */}
//         <button className="text-muted-foreground hover:text-primary transition">
//           <LogOut className="w-5 h-5" />
//         </button>
//       </div>
//     </TooltipProvider>
//   )
// }

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LogOut, Settings } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';

export function AccountToolbar() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-4 justify-between mx-2 px-4 py-2 bg-muted shadow-sm rounded-md">
        {/* Аватар с тултипом */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>VB</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent
            align="start"
            side="bottom"
            sideOffset={8}
            className="bg-zinc-800 text-white text-sm p-3 rounded-md"
          >
            <div className="font-bold">Viacheslav Bocharov</div>
            <div className="text-muted-foreground">
              viacheslavbocharov@gmail.com
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Переключатель темы (ShadCN-стандарт) */}
        <ModeToggle />

        {/* Настройки */}
        <button
          className="text-muted-foreground hover:text-primary transition"
          onClick={() => console.log('⚙️ Настройки')}
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Выход */}
        <button
          className="text-muted-foreground hover:text-primary transition"
          onClick={() => console.log('🚪 Выход')}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </TooltipProvider>
  );
}
