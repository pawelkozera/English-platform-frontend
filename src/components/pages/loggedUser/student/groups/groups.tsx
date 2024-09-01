import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";
import { CreateGroupForm } from "./createGroupForm";

export function Groups() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <CreateGroupForm />
      </main>
      
      <Footer />
    </div>
  )
}