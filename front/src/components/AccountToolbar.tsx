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
