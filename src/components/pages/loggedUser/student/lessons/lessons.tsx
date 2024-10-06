import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";
import { LessonsDisplay } from "./lessonsDisplay";

export function Lessons() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <LessonsDisplay />
      </main>
      
      <Footer />
    </div>
  )
}