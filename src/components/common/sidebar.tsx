import { BookOpen, RepeatIcon, Gamepad2, UserCircle, LogOut } from "lucide-react"
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/theme/mode-toggle";

export function Sidebar() {
  return (
    <aside className="w-64 shadow-md">
        <div className="p-4">
            <h1 className="flex text-2xl font-bold">
                <Link to={"/home"}>
                    LearnJoy
                </Link>
            </h1>
            <nav className="mt-6">
            <div className="flex py-8">
                <ModeToggle></ModeToggle>
            </div>
            <div className="flex items-center px-4 py-4 hover:bg-secondary">
                <BookOpen className="w-5 h-5 mr-3" />
                Lessons
            </div>
            <Link to={"/repetitions"} className="flex items-center px-4 py-4 hover:bg-secondary">
                <RepeatIcon className="w-5 h-5 mr-3" />
                Repetitions
            </Link>
            <div className="flex items-center px-4 py-4 hover:bg-secondary">
                <Gamepad2 className="w-5 h-5 mr-3" />
                Language Games
            </div>
            <div className="flex items-center px-4 py-4 hover:bg-secondary">
                <UserCircle className="w-5 h-5 mr-3" />
                Profile
            </div>
            <div className="py-12">
                <Link to={"/"} className="flex items-center px-4 py-4 hover:bg-secondary">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Link>
            </div>
            </nav>
        </div>
    </aside>
  )
}