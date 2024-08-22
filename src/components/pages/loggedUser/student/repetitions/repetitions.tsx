import { Sidebar } from "@/components/common/sidebar";
import { Footer } from "@/components/common/footer";
import { WordRepetitionTrainer } from "./wordRepetitionTrainer";

export function Repetitions() {
  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <WordRepetitionTrainer />
      </main>
      
      <Footer />
    </div>
  )
}