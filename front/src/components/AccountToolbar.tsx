import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LogOut, Settings } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import api from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetFileManager } from '@/store/fileManagerSlice';
import { UserSettingsDialog } from './UserSettingsDialog';

export function AccountToolbar() {
  const { firstName, lastName, email } = useSelector(
    (state: RootState) => state.fileManager, // ← адаптируй путь, если нужно
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initials =
    (firstName?.[0] ?? '').toUpperCase() + (lastName?.[0] ?? '').toUpperCase();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
      dispatch(resetFileManager());
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
    <TooltipProvider>
      <div className="flex items-center gap-4 justify-between mx-2 px-4 py-2 bg-muted shadow-sm rounded-md">
        {/* Аватар с тултипом */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent
            align="start"
            side="bottom"
            sideOffset={8}
            className="bg-zinc-800 text-white text-sm p-3 rounded-md"
          >
            <div className="font-bold">{`${firstName} ${lastName}`}</div>
            <div className="text-muted-foreground">{email}</div>
          </TooltipContent>
        </Tooltip>

        {/* Переключатель темы (ShadCN-стандарт) */}
        <ModeToggle />

        {/* Настройки */}
        {/* <button
          className="cursor-pointer text-muted-foreground hover:text-primary transition"
          onClick={handleSettings}
        >
          <Settings className="w-5 h-5" />
        </button> */}
        <UserSettingsDialog />

        {/* Выход */}
        <button
          className="cursor-pointer text-muted-foreground hover:text-primary transition"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </TooltipProvider>
    </>
  );
}
