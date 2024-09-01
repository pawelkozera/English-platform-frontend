import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";

export function Profile() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
      </main>
      
      <Footer />
    </div>
  )
}