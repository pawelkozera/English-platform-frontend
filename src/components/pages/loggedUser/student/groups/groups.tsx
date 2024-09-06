import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";
import { GroupManagement } from "./groupManagement";

export function Groups() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <GroupManagement />
      </main>
      
      <Footer />
    </div>
  )
}