import { Sidebar } from "@/components/common/sidebar";
import { Content } from "./content";
import { Footer } from "@/components/common/footer";

export function MainPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Content />
      <Footer />
    </div>
  )
}