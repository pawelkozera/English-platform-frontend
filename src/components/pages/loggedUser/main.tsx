import { Sidebar } from "@/components/common/sidebar";
import { Content } from "./content";

export function MainPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Content />
    </div>
  )
}