import { BookOpen, RepeatIcon, Gamepad2, UserCircle, Users , LogOut } from "lucide-react"
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { useNavigate } from "react-router-dom";
import apiClient from "@/interceptor/axios-interceptor";
import { useUser } from '@/components/utils/UserContext';

export function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useUser();

    const handleLogout = async () => {
        try {
          await apiClient.post('/api/v1/auth/logout');
          logout();
          navigate('/');
        } catch (error) {
          console.error('Logout failed', error);
        }
      };

  return (
    <aside className="w-64 shadow-md">
        <div className="p-4">
            <h1 className="flex text-2xl font-bold">
                <Link to={"/home"}>
                    LearnJoy &#128039;
                </Link>
            </h1>
            <nav className="mt-6">
            <div className="flex py-8">
                <ModeToggle></ModeToggle>
            </div>
            <Link to={"/lessons"} className="flex items-center px-4 py-4 hover:bg-secondary">
                <BookOpen className="w-5 h-5 mr-3" />
                Lessons
            </Link>
            <Link to={"/repetitions"} className="flex items-center px-4 py-4 hover:bg-secondary">
                <RepeatIcon className="w-5 h-5 mr-3" />
                Repetitions
            </Link>
            <Link to={"/language-games"} className="flex items-center px-4 py-4 hover:bg-secondary">
                <Gamepad2 className="w-5 h-5 mr-3" />
                Language Games
            </Link>
            <Link to={"/groups"} className="flex items-center px-4 py-4 hover:bg-secondary">
                <Users className="w-5 h-5 mr-3" />
                Groups
            </Link>
            <Link to={"/profile"} className="flex items-center px-4 py-4 hover:bg-secondary">
                <UserCircle className="w-5 h-5 mr-3" />
                Profile
            </Link>
            <div className="py-12">
                <button onClick={handleLogout} className="flex items-center px-4 py-4 hover:bg-secondary">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
            </nav>
        </div>
    </aside>
  )
}