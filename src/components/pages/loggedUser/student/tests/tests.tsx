import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";
import { TestsManagement } from "./testsManagement";

export function Tests() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <TestsManagement />
      </main>
      
      <Footer />
    </div>
  )
}