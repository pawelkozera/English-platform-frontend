import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";
import { AnnouncementsManagement } from "./announcementsManagement";

export function Announcements() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <AnnouncementsManagement />
      </main>
      
      <Footer />
    </div>
  )
}