import { Sidebar } from "@/components/common/sidebar";
import { Content } from "./content";
import { Footer } from "@/components/common/footer";

export function MainPageLogged() {
  return (
    <div className="h-screen">
      <main className="flex">
        <Sidebar />
        <Content />
      </main>
      
      <Footer />
    </div>
  )
}