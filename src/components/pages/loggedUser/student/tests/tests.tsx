import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";
import { TestsDisplay } from "./testsDisplay";

export function Tests() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <TestsDisplay />
      </main>
      
      <Footer />
    </div>
  )
}